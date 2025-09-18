import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: String, required: true },
  doctor: { type: String, required: true },
  time: { type: String, required: true },   // later you might use Date
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  type: { type: String, required: true }    // e.g., Consultation, Surgery
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
