import Appointment from "../models/Appointment.js";

// GET all appointments
export const getAppointments = async (_req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
};

// POST add new appointment
export const addAppointment = async (req, res) => {
  try {
    const newAppt = new Appointment(req.body);
    const saved = await newAppt.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update appointment
export const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE appointment
export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};