import Branch from "../models/Branch.js";

// Create branch
export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all branches (with filters)
export const getBranches = async (req, res) => {
  try {
    const { status, type, city } = req.query;
    let filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (city) filters.location = city;

    const branches = await Branch.find(filters);
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one branch
export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: "Branch permanently deleted", branch });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
