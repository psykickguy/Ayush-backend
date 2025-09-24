import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getMyPatients,
  addPatient,
  getPatientById,
  updatePatient,
  deletePatient, // Import the new delete function
} from "../../controllers/doctor/patientController.js";

const router = express.Router();

// Protect all routes in this file
router.use(protect);

router.route("/").get(getMyPatients).post(addPatient);

// Chain all methods for a specific patient ID
router
  .route("/:id")
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient); // Add the delete method

export default router;
