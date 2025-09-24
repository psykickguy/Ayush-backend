import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";
import Activity from "../../models/Activity.js";

export const seedTestData = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const uniqueId = Date.now();

    // Clean up old data to avoid duplicates
    await Patient.deleteMany({ doctor: doctorId });
    await Appointment.deleteMany({ doctor: doctorId });
    await Activity.deleteMany({ doctor: doctorId });

    // 1. Create Sample Patients with full details
    const patient1 = await Patient.create({
      doctor: doctorId,
      name: "Sarah Johnson",
      email: `sarah.j.${uniqueId}@example.com`,
      age: 34,
      gender: "Female",
      phone: "+1 (555) 123-4567",
      lastVisit: new Date("2025-09-15"),
      condition: "Hypertension",
      status: "Active",
    });

    const patient2 = await Patient.create({
      doctor: doctorId,
      name: "Michael Chen",
      email: `michael.c.${uniqueId}@example.com`,
      age: 45,
      gender: "Male",
      phone: "+1 (555) 234-5678",
      lastVisit: new Date("2025-09-12"),
      condition: "Diabetes Type 2",
      status: "Active",
    });

    // 2. Create Sample Appointments
    await Appointment.create({
      doctor: doctorId,
      patient: patient1.id,
      date: new Date(),
      time: "09:00 AM",
      type: "Consultation",
    });
    await Appointment.create({
      doctor: doctorId,
      patient: patient2.id,
      date: new Date(),
      time: "10:30 AM",
      type: "Follow-up",
      status: "confirmed",
    });

    // 3. Create Sample Activities
    await Activity.create({
      doctor: doctorId,
      message: "Completed consultation with Sarah Johnson",
    });

    res.status(201).json({ message: "Test data created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed test data." });
  }
};
