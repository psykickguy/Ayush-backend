import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // --- Existing Fields ---
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
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

    // --- NEW FIELDS FOR DETAILED PROFILE ---
    photoUrl: {
      type: String,
    },
    allergies: [
      {
        type: String,
      },
    ],
    emergencyContacts: [
      {
        name: { type: String, required: true },
        relationship: { type: String },
        phone: { type: String, required: true },
      },
    ],
    // ------------------------------------
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
