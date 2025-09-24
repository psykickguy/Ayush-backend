// models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    // THIS IS THE CRUCIAL FIELD THAT LINKS A PATIENT TO A DOCTOR
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  },
  { timestamps: true } // This automatically adds createdAt and updatedAt
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
