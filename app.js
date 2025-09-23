import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import branchRoutes from "./routes/admin/branchRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";
import appointmentRoutes from "./routes/admin/appointmentRoutes.js";
import analyticsRoutes from "./routes/admin/analyticsRoutes.js";
import settingsRoutes from "./routes/admin/settingsRoutes.js";
import dashboardRoutes from "./routes/admin/dashboardRoutes.js";
import authRoutes from "./routes/user/authRoutes.js";
import doctorRoutes from "./routes/doctor/doctorRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/branches", branchRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/users", userRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/settings", settingsRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/doctor", doctorRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // stop app if DB fails
  }
};

connectDB();
