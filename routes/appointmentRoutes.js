import express from "express";
import { getAppointments, addAppointment, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", getAppointments);
router.post("/", addAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
