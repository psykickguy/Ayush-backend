import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
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
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "30 days"
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
