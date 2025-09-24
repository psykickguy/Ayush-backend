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
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    type: { type: String, required: true }, // e.g., Consultation, Follow-up

    // --- NEW FIELDS ADDED TO SUPPORT DOCTOR UI ---
    duration: {
      type: Number, // Represents length in minutes
      required: true,
    },
    notes: {
      type: String, // For clinical or administrative notes
    },
    // ------------------------------------------
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
