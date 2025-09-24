import mongoose from "mongoose";

const treatmentPlanSchema = new mongoose.Schema(
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
    condition: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    medications: [{ type: String }],
    goals: [
      {
        description: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    notes: [
      {
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // We store the ID of the next appointment for easy linking
    nextAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TreatmentPlan", treatmentPlanSchema);
