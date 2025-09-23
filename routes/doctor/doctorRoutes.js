import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getDoctorProfile,
  universalSearch,
  getNotifications,
} from "../../controllers/doctor/doctorController.js";

const router = express.Router();

// All routes here are protected and require a valid JWT
router.get("/profile", protect, getDoctorProfile);
router.get("/search", protect, universalSearch);
router.get("/notifications", protect, getNotifications);

export default router;
