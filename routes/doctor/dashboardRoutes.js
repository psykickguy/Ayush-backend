import express from "express";
import { protect } from "../../middleware/authMiddleware.js"; // Adjust path if needed
import { getDashboardSummary } from "../../controllers/doctor/dashboardController.js"; // Adjust path

const router = express.Router();

// This single endpoint will provide all data for the doctor's dashboard
router.get("/dashboard-summary", protect, getDashboardSummary);

// You can add your other doctor routes here later
// router.get('/profile', protect, getDoctorProfile);

export default router;
