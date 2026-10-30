const express = require("express");
const router = express.Router();

// ✅ Correct import
const {
  register,
  login,
  forgotPassword
} = require("../controllers/userController");

// ✅ DO NOT use () here
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
