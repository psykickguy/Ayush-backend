import twilio from "twilio";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import RecordShare from "../../models/RecordShare.js";
import Patient from "../../models/Patient.js";
import LabResult from "../../models/LabResult.js";
import Prescription from "../../models/Prescription.js";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// @desc    Step 1: A doctor requests access, an OTP is sent to the patient
// @route   POST /api/sharing/request-otp
export const requestOtp = async (req, res) => {
  const { patientId } = req.body;
  const requestingDoctorId = req.user.id;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient || !patient.phone) {
      return res
        .status(404)
        .json({ message: "Patient or patient phone number not found." });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create a record of this sharing attempt
    const shareRecord = await RecordShare.create({
      patient: patientId,
      requestingDoctor: requestingDoctorId,
      otp,
      otpExpires,
    });

    // Send the SMS via Twilio
    await twilioClient.messages.create({
      body: `Your MedCare Pro verification code is: ${otp}. It is valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: patient.phone,
    });

    res
      .status(200)
      .json({ shareId: shareRecord._id, message: "OTP sent to patient." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

// @desc    Step 2: The patient gives the OTP, it's verified, and an access token is created
// @route   POST /api/sharing/verify-otp
export const verifyOtp = async (req, res) => {
  const { shareId, otp, permissions } = req.body; // permissions is an array like ['labs', 'prescriptions']

  try {
    const shareRecord = await RecordShare.findById(shareId);

    if (
      !shareRecord ||
      shareRecord.otp !== otp ||
      shareRecord.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Create a secure JWT (access token) for viewing the data
    const accessToken = jwt.sign(
      { shareId: shareRecord._id, permissions },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // The link to view records is valid for 24 hours
    );

    shareRecord.isVerified = true;
    shareRecord.permissions = permissions;
    shareRecord.accessToken = accessToken;
    shareRecord.otp = undefined; // Clear OTP for security
    await shareRecord.save();

    // This is the secure link/token you would give to the external party
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error during verification." });
  }
};

// @desc    Step 3: An external party views the shared records using the access token
// @route   GET /api/sharing/view/:accessToken
export const viewSharedRecord = async (req, res) => {
  try {
    const { accessToken } = req.params;
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const shareRecord = await RecordShare.findById(decoded.shareId);
    if (!shareRecord || !shareRecord.isVerified) {
      return res
        .status(401)
        .json({ message: "Invalid or unauthorized access token." });
    }

    const patientId = shareRecord.patient;
    const permissions = shareRecord.permissions;
    let sharedData = {
      patient: await Patient.findById(patientId).select("name allergies"),
    };

    // Conditionally fetch data based on the permissions granted
    if (permissions.includes("labs")) {
      sharedData.labResults = await LabResult.find({ patient: patientId });
    }
    if (permissions.includes("prescriptions")) {
      sharedData.prescriptions = await Prescription.find({
        patient: patientId,
      });
    }
    // Add other permissions as needed

    res.json(sharedData);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired access token." });
  }
};
