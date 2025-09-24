import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // CHANGED: Use ObjectId to link to the actual Patient document
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // This tells Mongoose to look in the 'Patient' collection
      required: true,
    },

    // CHANGED: Use ObjectId to link to the actual User (doctor) document
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This tells Mongoose to look in the 'User' collection
      required: true,
    },

    // ADDED: A dedicated field for the date
    date: { type: Date, required: true },

    time: { type: String, required: true },

    // CHANGED: Updated the enum to include all necessary statuses
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    type: { type: String, required: true }, // e.g., Consultation, Follow-up
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
