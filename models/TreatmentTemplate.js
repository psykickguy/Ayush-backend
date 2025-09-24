import mongoose from "mongoose";

const treatmentTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'Hypertension Protocol'
  condition: { type: String, required: true },
  defaultDurationDays: { type: Number, default: 90 },
  defaultMedications: [{ type: String }],
  defaultGoals: [{ type: String }],
});

export default mongoose.model("TreatmentTemplate", treatmentTemplateSchema);
