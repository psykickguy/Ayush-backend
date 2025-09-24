import Appointment from "../../models/Appointment.js";
import Patient from "../../models/Patient.js";

// @desc    Create a new appointment for the logged-in doctor
// @route   POST /api/doctor/appointments
export const createAppointment = async (req, res) => {
  try {
    const { patient, date, time, type, duration, notes } = req.body;

    const newAppointment = await Appointment.create({
      doctor: req.user.id,
      patient,
      date,
      time,
      type,
      duration,
      notes,
    });

    // Optional: Create an activity log
    // await Activity.create({ doctor: req.user.id, message: `Scheduled ${type} for patient...` });

    res.status(201).json(newAppointment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

// @desc    Get appointments for the logged-in doctor (with filtering by date and search)
// @route   GET /api/doctor/appointments
export const getMyAppointments = async (req, res) => {
  try {
    const { date, search } = req.query;
    const doctorId = req.user._id;

    // --- Aggregation Pipeline for Advanced Filtering & Searching ---
    const pipeline = [];

    // Stage 1: Match appointments for the current doctor
    pipeline.push({ $match: { doctor: doctorId } });

    // Stage 2: Filter by a specific date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      pipeline.push({ $match: { date: { $gte: startDate, $lte: endDate } } });
    }

    // Stage 3: Lookup patient information to search by patient name
    pipeline.push({
      $lookup: {
        from: "patients", // The actual collection name for Patients
        localField: "patient",
        foreignField: "_id",
        as: "patientInfo",
      },
    });

    // Deconstruct the patientInfo array to be a single object
    pipeline.push({ $unwind: "$patientInfo" });

    // Stage 4: Filter by search term (patient name or appointment type)
    if (search) {
      const searchRegex = new RegExp(search, "i");
      pipeline.push({
        $match: {
          $or: [{ "patientInfo.name": searchRegex }, { type: searchRegex }],
        },
      });
    }

    // Stage 5: Sort the results
    pipeline.push({ $sort: { date: 1, time: 1 } });

    const appointments = await Appointment.aggregate(pipeline);

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update an appointment for the logged-in doctor
// @route   PUT /api/doctor/appointments/:id
export const updateMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (req.body.status === "completed" && appointment.status !== "completed") {
      await Patient.findByIdAndUpdate(appointment.patient, {
        lastVisit: new Date(),
      });
    }

    res.json(updatedAppointment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating appointment", error: error.message });
  }
};

// @desc    Delete (cancel) an appointment
// @route   DELETE /api/doctor/appointments/:id
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Instead of deleting, it's often better to change the status to 'cancelled'
    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
