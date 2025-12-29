import express from "express";
import { getHospitals } from "../../controllers/patient/hospitalController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protected because the app likely sends the token for all API calls
// If you want it public (before login), remove 'protect'
router.get("/", protect, getHospitals); 

export default router;