import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    passwordPolicy: { type: String, default: "strong" },
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 }, // minutes
  },
  { timestamps: true }
);

export default mongoose.model("Settings", SettingsSchema);
