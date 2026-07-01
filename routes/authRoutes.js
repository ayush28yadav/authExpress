import express from "express";
import {
  getAdminArea,
  getCurrentUser,
  getStudentArea,
  getTeacherArea,
  loginUser,
  logoutUser,
  signupUser,
  updateProfile
} from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public auth routes.
// The signup route accepts a profile image in the same request as the text fields.
// upload.single("profileImage") tells multer to look for a file field named profileImage.
router.post("/signup", upload.single("profileImage"), signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Logged-in user routes.
// protect makes sure the user is authenticated before these routes can run.
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, upload.single("profileImage"), updateProfile);

// Role-based example routes.
// These routes show how authorization middleware can protect parts of the app.
router.get("/student-area", protect, getStudentArea);
router.get(
  "/teacher-area",
  protect,
  authorizeRoles("teacher", "admin"),
  getTeacherArea
);
router.get("/admin-area", protect, authorizeRoles("admin"), getAdminArea);

export default router;
