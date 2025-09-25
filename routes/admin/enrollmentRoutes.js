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

// This is the corrected line:
// It tells the server to use the 'upload' middleware to handle a single file
// from a form field named "image" BEFORE it calls createEnrollment.
router.route("/").post(upload.single("image"), createEnrollment).get(getEnrollments);

router
  .route("/:id")
  .get(getEnrollmentById)
  .put(updateEnrollment)
  .delete(deleteEnrollment);

export default router;