import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
