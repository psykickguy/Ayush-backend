import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";
import Activity from "../../models/Activity.js";

export const seedTestData = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const uniqueId = Date.now(); // Create a unique ID from the current timestamp

    // 1. Create Sample Patients (with unique emails)
    const patient1 = await Patient.create({
      name: "Sarah Johnson",
      email: `sarah.j.${uniqueId}@example.com`, // Made email unique
      doctor: doctorId,
    });
    const patient2 = await Patient.create({
      name: "Michael Chen",
      email: `michael.c.${uniqueId}@example.com`, // Made email unique
      doctor: doctorId,
    });

    // Clean up old appointment and activity data to avoid duplicates from previous runs
    await Appointment.deleteMany({ doctor: doctorId });
    await Activity.deleteMany({ doctor: doctorId });

    // 2. Create Sample Appointments
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 5);

    await Appointment.create({
      doctor: doctorId,
      patient: patient1.id,
      date: today,
      time: "09:00 AM",
      type: "Consultation",
    });
    await Appointment.create({
      doctor: doctorId,
      patient: patient2.id,
      date: today,
      time: "10:30 AM",
      type: "Follow-up",
      status: "confirmed",
    });
    await Appointment.create({
      doctor: doctorId,
      patient: patient1.id,
      date: lastWeek,
      time: "02:00 PM",
      type: "Check-up",
      status: "completed",
    });

    // 3. Create Sample Activities
    await Activity.create({
      doctor: doctorId,
      message: "Completed consultation with Sarah Johnson",
    });
    await Activity.create({
      doctor: doctorId,
      message: "Lab results reviewed for Michael Chen",
    });

    res.status(201).json({ message: "Test data created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed test data." });
  }
};
