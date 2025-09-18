import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["Doctor", "Nurse", "Admin"], required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  lastLogin: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
