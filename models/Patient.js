// models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },

    // --- NEW FIELDS ADDED FROM YOUR UI ---
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String },
    lastVisit: { type: Date },
    condition: { type: String },
    status: {
      type: String,
      enum: ["Active", "Follow-up", "Inactive"],
      default: "Active",
    },
    // ------------------------------------
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
