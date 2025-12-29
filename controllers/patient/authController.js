import User from "../../models/user.js";
import jwt from "jsonwebtoken";
// If you don't have otp-generator, run: npm install otp-generator
// Or use Math.random() for a simple version
import otpGenerator from "otp-generator"; 

export const loginPatient = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    // 1. Find or Create User
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name: "New Patient",
        phone,
        role: "Patient"
      });
    }

    // 2. Generate OTP (Simple numeric)
    const otp = otpGenerator.generate(6, { 
      upperCaseAlphabets: false, 
      specialChars: false, 
      lowerCaseAlphabets: false 
    });

    // 3. Save OTP to DB
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // 4. Log for Dev Mode (Since we don't have SMS set up yet)
    console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);

    res.json({ message: "OTP Sent", dev_otp: otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // --- FIX STARTS HERE ---
    // Create a payload that matches exactly what authMiddleware expects
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // --- FIX ENDS HERE ---
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};