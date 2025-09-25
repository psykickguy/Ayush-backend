import Enrollment from "../../models/Enrollment.js";
import cloudinary from "../../config/cloudinary.js";

// Create a new enrollment with image upload
export const createEnrollment = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    // Get patient and service IDs from the form-data body
    const { patient, service } = req.body;

    // Create a new enrollment object with data from the body and the Cloudinary upload result
    const newEnrollment = new Enrollment({
      patient,
      service,
      imageUrl: req.file.path, // This is the secure_url from Cloudinary
      cloudinaryId: req.file.filename, // This is the public_id from Cloudinary
    });

    // Save the new enrollment to the database
    await newEnrollment.save();

    res.status(201).json(newEnrollment);
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get all enrollments
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("patient", "name")
      .populate("service", "name");
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
      { new: true }
    );
    res.json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an enrollment
export const deleteEnrollment = async (req, res) => {
  try {
    // Find the enrollment in the database first
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Use the stored cloudinaryId to delete the image from Cloudinary
    if (enrollment.cloudinaryId) {
      await cloudinary.uploader.destroy(enrollment.cloudinaryId);
    }

    // Now, delete the enrollment record from the database
    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};