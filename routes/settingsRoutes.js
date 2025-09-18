import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

// Get current settings
router.get("/", getSettings);

// Update settings
router.put("/", updateSettings);

export default router;
  