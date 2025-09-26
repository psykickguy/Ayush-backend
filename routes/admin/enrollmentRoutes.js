import express from "express";
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../../controllers/admin/enrollmentController.js";
import upload from "../../middleware/multer.js"; // Make sure this is imported

const router = express.Router();

router.route("/").post(upload.array("documents", 10), createEnrollment).get(getEnrollments);
router
  .route("/:id")
  .get(getEnrollmentById)
  .put(updateEnrollment)
  .delete(deleteEnrollment);

export default router;