import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createAppointment,
  getMyAppointments,
  updateMyAppointment,
  deleteAppointment,
} from "../../controllers/doctor/appointmentController.js";

const router = express.Router();

// Protect all routes in this file
router.use(protect);

router.route("/").post(createAppointment).get(getMyAppointments);

router.route("/:id").put(updateMyAppointment).delete(deleteAppointment);

export default router;
