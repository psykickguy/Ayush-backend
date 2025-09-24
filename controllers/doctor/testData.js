import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";
import Activity from "../../models/Activity.js";
import TreatmentPlan from "../../models/TreatmentPlan.js";
import TreatmentTemplate from "../../models/TreatmentTemplate.js";

export const seedTestData = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // --- Clean Up Old Data ---
    await Patient.deleteMany({ doctor: doctorId });
    await Appointment.deleteMany({ doctor: doctorId });
    await Activity.deleteMany({ doctor: doctorId });
    await TreatmentPlan.deleteMany({ doctor: doctorId });

    // --- Seed Templates (one-time setup, harmless to run again) ---
    await TreatmentTemplate.deleteMany({}); // Clear all old templates
    await TreatmentTemplate.create([
      {
        name: "Hypertension Protocol",
        condition: "Hypertension",
        defaultMedications: ["Lisinopril 10mg"],
        defaultGoals: ["Monitor blood pressure daily"],
      },
      {
        name: "Diabetes Management",
        condition: "Diabetes Type 2",
        defaultMedications: ["Metformin 500mg"],
        defaultGoals: ["Check blood sugar twice daily", "Follow dietary plan"],
      },
    ]);

    // --- Create Interconnected Data ---
    const uniqueId = Date.now();

    // 1. Create Patients
    const patient1 = await Patient.create({
      doctor: doctorId,
      name: "Sarah Johnson",
      email: `sarah.j.${uniqueId}@example.com`,
      age: 34,
      gender: "Female",
      condition: "Hypertension",
      status: "Active",
    });
    const patient2 = await Patient.create({
      doctor: doctorId,
      name: "Michael Chen",
      email: `michael.c.${uniqueId}@example.com`,
      age: 45,
      gender: "Male",
      condition: "Diabetes Type 2",
      status: "Active",
    });

    // 2. Create Appointments
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const futureAppointment = await Appointment.create({
      doctor: doctorId,
      patient: patient1.id,
      date: nextWeek,
      time: "10:00 AM",
      type: "Follow-up",
      duration: 30,
      status: "confirmed",
    });

    // 3. Create Treatment Plans linked to Patients and Appointments
    await TreatmentPlan.create({
      patient: patient1.id,
      doctor: doctorId,
      condition: "Hypertension Management",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: "active",
      progress: 65,
      medications: ["Lisinopril 10mg", "Hydrochlorothiazide 25mg"],
      nextAppointment: futureAppointment._id, // Link to the real appointment
      goals: [{ description: "Lower average BP to 120/80", completed: false }],
    });

    res
      .status(201)
      .json({ message: "Comprehensive test data created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed test data." });
  }
};
