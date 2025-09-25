import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  requestOtp,
  verifyOtp,
  viewSharedRecord,
} from "../../controllers/doctor/sharingController.js";

const router = express.Router();

// Routes for the doctor to initiate sharing
router.post("/request-otp", protect, requestOtp);
router.post("/verify-otp", protect, verifyOtp);

// Public-facing route for viewing the shared data with a token
router.get("/view/:accessToken", viewSharedRecord);

export default router;
