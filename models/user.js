import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Make password optional if role is Patient
  password: { 
    type: String, 
    required: function() { return this.role !== 'Patient'; } 
  },
  email: { type: String, unique: true, sparse: true },
// --- NEW FIELDS FOR PATIENT APP ---
  phone: { type: String, unique: true, sparse: true }, 
  role: { 
    type: String, 
    enum: ["Doctor", "Nurse", "Admin", "Patient"], // Added 'Patient'
    required: true 
  },
  specialty: {
    type: String,
    required: function () {
      return this.role === "Doctor";
    },
  },
  // OTP Fields for authentication
  otp: { type: String },
  otpExpires: { type: Date },
  // ----------------------------------
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  lastLogin: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
