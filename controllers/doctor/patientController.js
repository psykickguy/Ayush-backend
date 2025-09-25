import mongoose from "mongoose";
import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";
import TreatmentPlan from "../../models/TreatmentPlan.js";
import LabResult from "../../models/LabResult.js";
import Prescription from "../../models/Prescription.js";

// --- STANDARD PATIENT CRUD & FILTERING ---

// @desc    Get all patients for the logged-in doctor (with filtering)
export const getMyPatients = async (req, res) => {
  try {
    const query = { doctor: req.user.id };
    const { search, gender, status } = req.query;

    if (gender) query.gender = gender;
    if (status) query.status = status;

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { condition: searchRegex },
        { email: searchRegex },
      ];
    }
    const patients = await Patient.find(query);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching patients" });
  }
};

// @desc    Add a new patient
// @route   POST /api/doctor/patients
// @access  Private

export const addPatient = async (req, res) => {
  try {
    // Ensure the user is logged in (middleware should handle this, but it's a good check)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const patientData = { ...req.body, doctor: req.user.id };
    const patientExists = await Patient.findOne({ email: patientData.email });
    if (patientExists) {
      return res
        .status(400)
        .json({ message: "Patient with this email already exists" });
    }
    const newPatient = await Patient.create(patientData);

    // If for some reason the patient wasn't created, send an error
    if (!newPatient) {
        return res.status(500).json({ message: "Error creating patient in database" });
    }

    // Send a 201 Created status and the new patient object as a response
    res.status(201).json(newPatient);

  } catch (error) {
    console.error("Error in addPatient:", error);
    res
      .status(400)
      .json({ message: "Error creating patient", error: error.message });
  }
};

// @desc    Get a single patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a patient's details
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPatient);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating patient", error: error.message });
  }
};

// @desc    Delete a patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" });
    }
    await Patient.findByIdAndDelete(req.params.id);
    // You might also want to delete related appointments, plans, etc. here
    res.json({ message: "Patient removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- DETAILED PROFILE & TIMELINE CONTROLLERS ---

// @desc    Get full profile data for a single patient
// @route   GET /api/doctor/patients/:id/profile
export const getPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);
    if (!patient || patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const [treatmentPlans, labResults, prescriptions] = await Promise.all([
      TreatmentPlan.find({ patient: patientId }),
      LabResult.find({ patient: patientId }).sort({ date: -1 }),
      Prescription.find({ patient: patientId }).sort({ date: -1 }),
    ]);
    res.json({
      patientDetails: patient,
      treatmentPlans,
      labResults,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a chronological timeline of all patient events
// @route   GET /api/doctor/patients/:id/timeline
export const getPatientTimeline = async (req, res) => {
  try {
    const patientId = new mongoose.Types.ObjectId(req.params.id);
    const patient = await Patient.findById(patientId);
    if (!patient || patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const timeline = await Appointment.aggregate([
      { $match: { patient: patientId } },
      {
        $addFields: {
          eventType: "Appointment",
          eventDate: "$date",
          summary: "$type",
        },
      },
      {
        $unionWith: {
          coll: "labresults",
          pipeline: [
            { $match: { patient: patientId } },
            {
              $addFields: {
                eventType: "Lab Result",
                eventDate: "$date",
                summary: "$testName",
              },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "prescriptions",
          pipeline: [
            { $match: { patient: patientId } },
            {
              $addFields: {
                eventType: "Prescription",
                eventDate: "$date",
                summary: "$medication",
              },
            },
          ],
        },
      },
      { $sort: { eventDate: -1 } },
      { $limit: 50 },
    ]);
    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
