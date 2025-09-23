import Patient from "../../models/Patient.js";
import Payment from "../../models/Payment.js";
import mongoose from "mongoose";

// GET /api/analytics
export const getAnalytics = async (req, res) => {
  try {
    const branchId = req.query.branch; // optional filter by branch
    const now = new Date();

    // Patient Growth
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const patientsThisMonth = await Patient.countDocuments({
      branch: branchId ? branchId : { $exists: true },
      createdAt: { $gte: startOfThisMonth },
    });

    const patientsLastMonth = await Patient.countDocuments({
      branch: branchId ? branchId : { $exists: true },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const patientGrowth =
      patientsLastMonth === 0
        ? 100
        : ((patientsThisMonth - patientsLastMonth) / patientsLastMonth) * 100;

    // Revenue
    const paymentsThisMonth = await Payment.aggregate([
      {
        $match: {
          branch: branchId
            ? new mongoose.Types.ObjectId(branchId)
            : { $exists: true },
          createdAt: { $gte: startOfThisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenue = paymentsThisMonth[0]?.total || 0;

    // Popular Services
    const services = await Payment.aggregate([
      {
        $match: {
          branch: branchId
            ? new mongoose.Types.ObjectId(branchId)
            : { $exists: true },
          createdAt: { $gte: startOfThisMonth },
        },
      },
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalServices = services.reduce((acc, s) => acc + s.count, 0);

    const popularServices = services.map((s) => ({
      name: s._id,
      percentage: totalServices
        ? Math.round((s.count / totalServices) * 100)
        : 0,
    }));

    res.json({
      patientGrowth: patientGrowth.toFixed(1),
      revenue,
      popularServices,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
