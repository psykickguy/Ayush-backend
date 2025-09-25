import express from "express";
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../../controllers/admin/enrollmentController.js";

const router = express.Router();

router.route("/").post(createEnrollment).get(getEnrollments);

router
  .route("/:id")
  .get(getEnrollmentById)
  .put(updateEnrollment)
  .delete(deleteEnrollment);

export default router;