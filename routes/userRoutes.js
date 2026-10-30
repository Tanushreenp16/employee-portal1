const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

const {
  register,
  login,
  forgotPassword,
  getAllUsers,
  getMyProfile
} = require("../controllers/userController");

/* =================
   PUBLIC ROUTES
================= */
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

/* =================
   PROTECTED ROUTES
================= */

// Admin / HR → Get all users
router.get(
  "/all",
  auth,
  roleAuth(["Admin", "HR"]),
  getAllUsers
);

// Any logged-in user → own profile
router.get(
  "/me",
  auth,
  roleAuth(["Employee", "Admin", "HR"]),
  getMyProfile
);

module.exports = router;
