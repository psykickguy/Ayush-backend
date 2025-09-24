import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createPlan,
  getMyPlans,
  updatePlan,
  getTemplates,
} from "../../controllers/doctor/treatmentPlanController.js";

const router = express.Router();

router.use(protect); // Protect all routes in this file

// Route for fetching templates
router.get("/templates", getTemplates);

router.route("/").post(createPlan).get(getMyPlans);

router.route("/:id").put(updatePlan);

export default router;
