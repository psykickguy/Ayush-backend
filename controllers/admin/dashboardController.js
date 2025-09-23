import os from "os";
import User from "../../models/user.js";
import Branch from "../../models/Branch.js";
import Appointment from "../../models/Appointment.js"; // or Payment if you don’t have Appointment
import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
  try {
    const branchId = req.query.branch; // optional filter by branch
    const branchFilter = branchId ? { _id: branchId } : {};

    // 1️⃣ Total Users
    const totalUsers = await User.countDocuments({});

    // 2️⃣ Active Clinics
    const activeClinics = await Branch.countDocuments({
      type: "clinic",
      status: "active",
    });

    // 3️⃣ Today's Appointments
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysAppointments = await Appointment.countDocuments({
      ...(branchId && { branch: mongoose.Types.ObjectId(branchId) }),
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const uptimeSeconds = process.uptime();
    const expectedUptimeSeconds = 24 * 60 * 60; // expected 24h uptime
    const uptimePercent = Math.min(
      (uptimeSeconds / expectedUptimeSeconds) * 100,
      100
    );

    const memoryUsage = process.memoryUsage();
    const memoryPercent = Math.min(
      (1 - memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
      100
    );

    const loadAvg = os.loadavg()[0] || 0;
    const maxLoad = os.cpus().length; // 1 load per CPU core
    const loadPercent = Math.min((1 - loadAvg / maxLoad) * 100, 100);

    // Weighted system health
    const systemHealthPercent = (
      uptimePercent * 0.5 +
      memoryPercent * 0.3 +
      loadPercent * 0.2
    ).toFixed(1);

    // 5️⃣ Recent Activities (combine last 5 users & last 5 appointments)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name role createdAt");

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("patient service status createdAt");

    const recentActivities = [
      ...recentUsers.map((u) => ({
        type: "new_user",
        title: "New user registered",
        description: `${u.name} joined as a ${u.role}`,
        timestamp: u.createdAt,
      })),
      ...recentAppointments.map((a) => ({
        type:
          a.status === "completed"
            ? "appointment_completed"
            : "appointment_scheduled",
        title:
          a.status === "completed"
            ? "Appointment completed"
            : "New appointment",
        description: `${a.service} for patient ${a.patient}`,
        timestamp: a.createdAt,
      })),
    ].sort((a, b) => b.timestamp - a.timestamp); // newest first

    res.json({
      totalUsers,
      activeClinics,
      todaysAppointments,
      systemHealth: systemHealthPercent,
      recentActivities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
