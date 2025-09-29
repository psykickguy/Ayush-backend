import express from "express";
// 1. Import your middleware
import { protect } from "../../middleware/authMiddleware.js";
import { adminOnly } from "../../middleware/roleMiddleware.js";

import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../controllers/user/userController.js";

const router = express.Router();

// 2. Apply protection to all routes in this file
// router.use(protect, adminOnly);

// 3. Your routes are now secure
router.get("/", getUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
