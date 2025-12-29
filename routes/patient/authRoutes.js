import express from "express";
import { loginPatient, verifyOtp } from "../../controllers/patient/authController.js";

const router = express.Router();

router.post("/login", loginPatient);
router.post("/verify", verifyOtp);

export default router;