import Enrollment from "../../models/Enrollment.js";

// Create a new enrollment
export const createEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all enrollments
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("patient")
      .populate("service");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single enrollment by ID
export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("patient")
      .populate("service");
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an enrollment
export const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an enrollment
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};