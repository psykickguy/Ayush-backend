import Service from "../../models/Service.js";

// @desc    Create a new service
// @route   POST /api/admin/services
export const createService = async (req, res) => {
  try {
    const { name, branch } = req.body;
    const newService = await Service.create({ name, branch });
    res.status(201).json(newService);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating service", error: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/admin/services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("branch", "name");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};