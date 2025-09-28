import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";
import Activity from "../../models/Activity.js";
import TreatmentPlan from "../../models/TreatmentPlan.js";
import TreatmentTemplate from "../../models/TreatmentTemplate.js";
import LabResult from "../../models/LabResult.js";
import Prescription from "../../models/Prescription.js";

export const seedTestData = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // --- Clean Up ---
    await Patient.deleteMany({ doctor: doctorId });
    await Appointment.deleteMany({ doctor: doctorId });
    await Activity.deleteMany({ doctor: doctorId });
    await TreatmentPlan.deleteMany({ doctor: doctorId });
    await LabResult.deleteMany({ doctor: doctorId });
    await Prescription.deleteMany({ doctor: doctorId });

    // --- Create Data ---
    const uniqueId = Date.now();
    const today = new Date();

    // 1. Create Patients
    const patient1 = await Patient.create({
      doctor: doctorId,
      name: "Sarah Johnson",
      email: `sarah.j.${uniqueId}@example.com`,
      age: 34,
      gender: "Female",
      condition: "Hypertension",
      status: "Active",
      allergies: ["Pollen"],
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

    // 2. Create Appointments for both patients
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const futureAppointment1 = await Appointment.create({
      doctor: doctorId,
      patient: patient1.id,
      date: nextWeek,
      time: "10:00 AM",
      type: "Follow-up",
      duration: 30,
      status: "confirmed",
    });

    const futureAppointment2 = new Date();
    futureAppointment2.setDate(today.getDate() + 10);
    const futureAppointmentForChen = await Appointment.create({
      doctor: doctorId,
      patient: patient2.id,
      date: futureAppointment2,
      time: "11:00 AM",
      type: "Check-up",
      duration: 45,
      status: "confirmed",
    });

    // 3. Create Lab Results & Prescriptions
    await LabResult.create({
      patient: patient1.id,
      doctor: doctorId,
      testName: "Blood Pressure",
      result: "130/85 mmHg",
    });
    await LabResult.create({
      patient: patient2.id,
      doctor: doctorId,
      testName: "A1C Level",
      result: "6.8%",
    });
    await Prescription.create({
      patient: patient1.id,
      doctor: doctorId,
      medication: "Lisinopril 10mg",
      dosage: "Once daily",
      duration: "30 days",
    });

    // 4. Create Treatment Plans for BOTH patients
    await TreatmentPlan.create({
      patient: patient1.id,
      doctor: doctorId,
      condition: "Hypertension Management",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: "active",
      progress: 65,
      medications: ["Lisinopril 10mg"],
      nextAppointment: futureAppointment1._id,
      goals: [{ description: "Lower average BP to 120/80" }],
    });

    // ADDED: A treatment plan for Michael Chen
    await TreatmentPlan.create({
      patient: patient2.id,
      doctor: doctorId,
      condition: "Diabetes Management",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
      status: "active",
      progress: 40,
      medications: ["Metformin 500mg"],
      nextAppointment: futureAppointmentForChen._id,
      goals: [{ description: "Maintain A1C level below 7.0%" }],
    });

    res
      .status(201)
      .json({
        message: "Fully interconnected test data created successfully!",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed test data." });
  }
};
