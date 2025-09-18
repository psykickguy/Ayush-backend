import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";




dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// after app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


