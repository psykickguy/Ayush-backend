import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    amount: { type: Number, required: true },
    service: { type: String, required: true }, // "General Consultation", "Surgery", etc.
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
