import cron from "node-cron";
import Patient from "../models/Patient.js"; // Adjust path if needed

const updatePatientStatus = async () => {
  console.log("🔄 Running scheduled task: Checking for inactive patients...");

  try {
    const cutoffDate = new Date();
    // Set the date to 180 days in the past
    cutoffDate.setDate(cutoffDate.getDate() - 180);

    // Find all 'Active' patients whose last visit was before the cutoff date
    const inactivePatients = await Patient.find({
      status: "Active",
      lastVisit: { $lt: cutoffDate },
    });

    if (inactivePatients.length === 0) {
      console.log("No inactive patients to update.");
      return;
    }

    const patientIdsToUpdate = inactivePatients.map((p) => p._id);

    // Update all found patients to 'Inactive' in a single operation
    const result = await Patient.updateMany(
      { _id: { $in: patientIdsToUpdate } },
      { $set: { status: "Inactive" } }
    );

    console.log(
      `✅ Successfully updated ${result.modifiedCount} patients to Inactive.`
    );
  } catch (error) {
    console.error("❌ Error during scheduled patient status update:", error);
  }
};

export const startScheduledJobs = () => {
  // This cron expression means "run at 2:00 AM every day"
  // You can generate expressions at sites like crontab.guru
  cron.schedule("0 2 * * *", updatePatientStatus, {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set your timezone
  });
};
