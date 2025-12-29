import Appointment from "../../models/Appointment.js";
import Patient from "../../models/Patient.js";
// Removed unused: import Branch from "../../models/Branch.js"; 

// @desc    Book a new appointment by patient
// @route   POST /api/patient/appointments
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    // Data sent from the mobile app
    const { doctorId, branchId, date, time, type, symptoms, notes } = req.body;

    // 1. Find the Patient Profile linked to this User
    const patientProfile = await Patient.findOne({ user: userId });

    if (!patientProfile) {
      return res.status(404).json({ message: "Patient profile not found. Please contact admin." });
    }

    // 2. Basic Validation
    if (!doctorId || !branchId || !date || !time || !type) {
      return res.status(400).json({ message: "Please provide all required fields (doctor, hospital, date, time, type)" });
    }

    // 3. Create the Appointment
    const newAppointment = new Appointment({
      patient: patientProfile._id, // Auto-linked based on login token
      doctor: doctorId,
      branch: branchId,
      date: new Date(date), // Ensure it's saved as a Date object
      time,
      type,
      duration: 30, // Default duration, or get from request if app provides it
      status: "pending", // Default status for patient bookings
      symptoms: symptoms || [],
      notes: notes || "",
    });

    const savedAppointment = await newAppointment.save();

    // 4. (Optional Future Step) Send Notification to Doctor/Branch here

    res.status(201).json({
      message: "Appointment booked successfully",
      appointmentId: savedAppointment._id
    });

  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ... keep your existing getMyAppointments function below

// @desc    Get my appointments (Upcoming & History)
// @route   GET /api/patient/appointments
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Find the Patient Profile linked to this User
    const patientProfile = await Patient.findOne({ user: userId });

    if (!patientProfile) {
      return res.json({ upcoming: [], history: [] });
    }

    // 2. Fetch Appointments
    // Now that 'branch' is in the schema, populate will work correctly
    const appointments = await Appointment.find({ patient: patientProfile._id })
      .populate("doctor", "name specialty") 
      .populate("branch", "name address location") 
      .sort({ date: 1 });

    // 3. Separate into Upcoming and History
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const history = [];

    appointments.forEach((appt) => {
      const formattedAppt = {
        id: appt._id,
        doctorName: appt.doctor ? appt.doctor.name : "Unknown Doctor",
        // This will now correctly show the Branch Name instead of "Main Clinic"
        hospitalName: appt.branch ? appt.branch.name : "Main Clinic", 
        hospitalAddress: appt.branch ? appt.branch.address : "",
        date: appt.date,
        time: appt.time,
        type: appt.type,
        status: appt.status,
        symptoms: appt.symptoms || [],
      };

      const apptDate = new Date(appt.date);
      // Logic: If date is today or future, and not cancelled/completed
      if (apptDate >= today && appt.status !== 'cancelled' && appt.status !== 'completed') {
        upcoming.push(formattedAppt);
      } else {
        history.push(formattedAppt);
      }
    });

    res.json({ upcoming, history });

  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


