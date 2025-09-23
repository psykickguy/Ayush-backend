import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true }, // e.g., "Completed consultation with Sarah Johnson"
    link: { type: String }, // Optional link to the relevant page
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
