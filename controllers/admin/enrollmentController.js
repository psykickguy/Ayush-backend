import Enrollment from "../../models/Enrollment.js";
import cloudinary from "../../config/cloudinary.js";

// Create a new hospital enrollment
export const createEnrollment = async (req, res) => {
  try {
    const {
      hospitalName,
      facilityType,
      street,
      city,
      state,
      zip,
      country,
      lat,
      lng,
      contactEmail,
      contactPhone,
      registrationNumber,
    } = req.body;

    // The 'upload.array' middleware puts uploaded files in `req.files`
    const documents = req.files ? req.files.map(file => ({
      url: file.path,          // The secure URL from Cloudinary
      cloudinaryId: file.filename, // The public_id from Cloudinary
      name: file.originalname,
      size: file.size,
    })) : [];

    const newEnrollment = new Enrollment({
      hospitalName,
      facilityType,
      address: { street, city, state, zip, country },
      // Save location only if both lat and lng are provided and valid
      location: (lat && lng) ? { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] } : undefined,
      contactEmail,
      contactPhone,
      registrationNumber,
      documents, // Save the array of document information
    });

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
    const enrollments = await Enrollment.find();
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single enrollment by ID
export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an enrollment (basic implementation)
export const updateEnrollment = async (req, res) => {
  try {
    // Note: This does not handle file updates. That would require more logic.
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an enrollment
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Delete all associated documents from Cloudinary
    if (enrollment.documents && enrollment.documents.length > 0) {
      const idsToDelete = enrollment.documents.map(doc => doc.cloudinaryId);
      // Use Cloudinary's bulk deletion if you have many files
      await cloudinary.api.delete_resources(idsToDelete);
    }

    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({ message: "Enrollment and associated documents deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};