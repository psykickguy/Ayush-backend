import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
// --- ADD THIS FIELD ---
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // This matches the model name in Branch.js
      required: true, // Set to true if every appointment must have a location
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    notes: { type: String },
    
    // NEW: App allows users to input symptoms
    symptoms: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);