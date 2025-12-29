import express from "express";
// Import the new function
import { getMyAppointments, bookAppointment } from "../../controllers/patient/appointmentController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Existing GET route
router.get("/", protect, getMyAppointments);

// NEW POST route
router.post("/", protect, bookAppointment);

export default router;