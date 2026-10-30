const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Employee } = require("../models");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  console.log("✅ Register function called - NEW VERSION");
  console.log("Request body:", req.body);
  
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "Employee"
    });

    // Auto create employee
    await Employee.create({
      name,
      email,
      user_id: user.id,
      status: "Active"
    });

    console.log("✅ User and employee created successfully");
    res.json({ message: "User & employee created successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  console.log("✅ Login function called");
  console.log("Request body:", req.body);
  
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    console.log("User found:", user ? `Yes - ${user.email}` : "No");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);

    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);

    const updated = await User.update(
      { password: hashed },
      { where: { email } }
    );

    if (!updated[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
};

/* ================= GET ALL USERS (Admin / HR) ================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"]
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ================= GET MY PROFILE ================= */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"]
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
