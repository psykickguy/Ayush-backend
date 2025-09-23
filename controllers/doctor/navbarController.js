import Patient from "../../models/Patient.js"; // You will need to create these models
import Appointment from "../../models/Appointment.js"; // You will need to create these models
import Notification from "../../models/notification.js";

// Universal search for patients, appointments, etc.
export const universalSearch = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const searchRegex = new RegExp(searchTerm, "i"); // 'i' for case-insensitive

    // Perform searches in parallel
    const [patients, appointments] = await Promise.all([
      Patient.find({ name: searchRegex }),
      Appointment.find({ description: searchRegex }), // Or search by patient name within appointments
    ]);

    res.json({ patients, appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error during search" });
  }
};

// Get the logged-in doctor's profile
export const getDoctorProfile = async (req, res) => {
  // The user object is attached to the request by our 'protect' middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Get notifications for the logged-in doctor
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Show newest first
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
