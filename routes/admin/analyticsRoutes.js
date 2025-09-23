import express from "express";
import { getAnalytics } from "../../controllers/admin/analyticsController.js";

const router = express.Router();

router.get("/", getAnalytics);

export default router;
