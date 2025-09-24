import Patient from "../../models/Patient.js"; // Adjust path if needed

// @desc    Get all patients for the logged-in doctor (with filtering)
// @route   GET /api/doctor/patients
// @access  Private (for Doctors)
export const getMyPatients = async (req, res) => {
  try {
    // --- Start Building the Query ---
    // Base query always ensures we only get patients for the logged-in doctor
    const query = { doctor: req.user.id };

    // --- Handle Dedicated Filters (from the Filter button) ---
    // Example: /api/doctor/patients?gender=Female&status=Active
    if (req.query.gender) {
      query.gender = req.query.gender;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    // You can add more filters here, like for `branch`

    // --- Handle General Search Term ---
    // Example: /api/doctor/patients?search=johnson
    if (req.query.search) {
      const searchTerm = req.query.search;
      const searchRegex = new RegExp(searchTerm, "i"); // Case-insensitive

      query.$or = [
        { name: searchRegex },
        { condition: searchRegex },
        { email: searchRegex },
      ];
    }

    const patients = await Patient.find(query);

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching patients" });
  }
};

// @desc    Add a new patient
// @route   POST /api/doctor/patients
// @access  Private
export const addPatient = async (req, res) => {
  try {
    const patientData = { ...req.body, doctor: req.user.id };

    const patientExists = await Patient.findOne({ email: patientData.email });
    if (patientExists) {
      return res
        .status(400)
        .json({ message: "Patient with this email already exists" });
    }

    const newPatient = await Patient.create(patientData);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error creating patient", error: error.message });
  }
};

// @desc    Get a single patient by ID
// @route   GET /api/doctor/patients/:id
// @access  Private
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Security Check: Ensure the patient belongs to the logged-in doctor
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" }); // Use 404 to not reveal existence
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a patient's details
// @route   PUT /api/doctor/patients/:id
// @access  Private
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Security Check: Ensure the patient belongs to the logged-in doctor
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPatient);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating patient", error: error.message });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/doctor/patients/:id
// @access  Private
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Security Check: Ensure the patient belongs to the logged-in doctor
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
