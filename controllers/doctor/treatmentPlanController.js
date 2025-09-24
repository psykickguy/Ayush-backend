import TreatmentPlan from "../../models/TreatmentPlan.js";
import TreatmentTemplate from "../../models/TreatmentTemplate.js";
import Patient from "../../models/Patient.js";

// @desc    Create a new treatment plan
// @route   POST /api/doctor/treatment-plans
export const createPlan = async (req, res) => {
  try {
    const planData = { ...req.body, doctor: req.user.id };
    const newPlan = await TreatmentPlan.create(planData);
    res.status(201).json(newPlan);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating plan", error: error.message });
  }
};

// @desc    Get all treatment plans for the doctor's patients
// @route   GET /api/doctor/treatment-plans
export const getMyPlans = async (req, res) => {
  try {
    const plans = await TreatmentPlan.find({ doctor: req.user.id })
      .populate("patient", "name")
      .populate("nextAppointment", "date time"); // Populate related data
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a treatment plan (e.g., progress, notes)
// @route   PUT /api/doctor/treatment-plans/:id
export const updatePlan = async (req, res) => {
  try {
    const plan = await TreatmentPlan.findById(req.params.id);
    if (!plan || plan.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Treatment plan not found" });
    }
    const updatedPlan = await TreatmentPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPlan);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating plan", error: error.message });
  }
};

// @desc    Get all available treatment templates
// @route   GET /api/doctor/treatment-plans/templates
export const getTemplates = async (req, res) => {
  try {
    const templates = await TreatmentTemplate.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
