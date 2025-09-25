import mongoose from "mongoose";

const recordShareSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    requestingDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    // Store which sections the patient agreed to share
    permissions: [
      {
        type: String,
        enum: ["history", "medications", "labs", "prescriptions"],
      },
    ],
    accessToken: { type: String }, // The JWT for viewing the data
  },
  { timestamps: true }
);

export default mongoose.model("RecordShare", recordShareSchema);
