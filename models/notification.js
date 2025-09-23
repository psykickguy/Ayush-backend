import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The user to notify
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String }, // e.g., '/appointments/some-id'
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
