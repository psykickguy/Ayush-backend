import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";
import Activity from "../../models/Activity.js";
// Import other models for Reviews and Alerts as you create them

// @desc    Get dashboard summary for a doctor
// @route   GET /doctor/dashboard-summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // --- Time Ranges ---
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const lastWeekStart = new Date(todayStart);
    lastWeekStart.setDate(todayStart.getDate() - 7);

    // --- Perform all database queries in parallel for efficiency ---
    const [
      totalPatients,
      newPatientsLastWeek,
      todaysAppointmentsCount,
      lastWeekAppointmentsCount,
      todaysSchedule,
      recentActivities,
    ] = await Promise.all([
      // Stat: Total Patients
      Patient.countDocuments({ doctor: doctorId }),
      // Stat: New Patients (for growth %)
      Patient.countDocuments({
        doctor: doctorId,
        createdAt: { $gte: lastWeekStart },
      }),
      // Stat: Today's Appointments
      Appointment.countDocuments({
        doctor: doctorId,
        date: { $gte: todayStart, $lte: todayEnd },
      }),
      // Stat: Last Week's Appointments (for comparison)
      Appointment.countDocuments({
        doctor: doctorId,
        date: { $gte: lastWeekStart, $lt: todayStart },
      }),
      // List: Today's Schedule
      Appointment.find({
        doctor: doctorId,
        date: { $gte: todayStart, $lte: todayEnd },
      })
        .populate("patient", "name") // Get patient's name
        .sort({ date: "asc" }),
      // List: Recent Activities
      Activity.find({ doctor: doctorId }).sort({ createdAt: "desc" }).limit(5),
    ]);

    // --- Assemble the final dashboard data object ---
    const dashboardData = {
      stats: {
        totalPatients: {
          value: totalPatients,
          // A simple growth calculation. You can make this more complex.
          change: `+${newPatientsLastWeek}`,
          changeType: "positive",
        },
        todaysAppointments: {
          value: todaysAppointmentsCount,
          change: `+${todaysAppointmentsCount - lastWeekAppointmentsCount / 7}`, // Simplified change
          changeType: "positive",
        },
        // You would add similar logic for Pending Reviews and Critical Alerts
        pendingReviews: { value: 7, change: "-2", changeType: "negative" }, // Placeholder
        criticalAlerts: { value: 3, change: "+1", changeType: "warning" }, // Placeholder
      },
      todaysSchedule,
      recentActivities,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
};
