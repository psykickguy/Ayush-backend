import express from "express";
import {
  createService,
  getServices,
} from "../../controllers/admin/serviceController.js";

const router = express.Router();

router.route("/").post(createService).get(getServices);

export default router;