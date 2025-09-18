import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["clinic", "hospital"], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    location: { type: String, required: true },
    address: { type: String },
    contactPerson: { type: String },
    contactNumber: { type: String },
    workingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "18:00" },
    },
    holidaySchedule: [{ type: Date }],
    staffCount: { type: Number, default: 0 },
    maxDailyAppointments: { type: Number, default: 100 },
    otpValidityDuration: { type: Number, default: 5 }, // minutes
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
