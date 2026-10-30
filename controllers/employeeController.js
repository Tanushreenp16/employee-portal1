const { Employee, Document, User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");


exports.addEmployee = async (req, res) => {
  console.log("📝 Add employee called");
  console.log("Request body:", req.body);
  console.log("User:", req.user);
  
  try {
    const { name, email } = req.body;

    // Validate email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user with this email already exists
    let user = await User.findOne({ where: { email } });
    
    // If user doesn't exist, create a new user
    if (!user) {
      console.log("🆕 Creating new user for employee");
      
      // Generate default password
      const defaultPassword = "Employee@123";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
      
      user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: "Employee"
      });
      
      console.log("✅ User created with ID:", user.id);
    } else {
      console.log("ℹ️ User already exists with ID:", user.id);
    }

    // Create employee with user_id reference
    const emp = await Employee.create({
      ...req.body,
      user_id: user.id
    });
    
    console.log("✅ Employee added successfully:", emp.id);
    res.json({ 
      message: "Employee and user created successfully", 
      emp,
      userId: user.id
    });
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    res.status(500).json({ message: "Error adding employee", error: err.message });
  }
};

// Get all employees
exports.listEmployees = async (req, res) => {
  const employees = await Employee.findAll({
    order: [["id", "ASC"]]
  });
  res.json(employees);
};

// Update employee
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the current employee to find the linked user
    const employee = await Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // If email is being updated, update it in the User table too
    if (req.body.email && req.body.email !== employee.email) {
      console.log("📧 Email updated, syncing with User table");
      
      // Check if a user with new email already exists
      const existingUser = await User.findOne({ where: { email: req.body.email } });
      
      if (existingUser && existingUser.id !== employee.user_id) {
        return res.status(400).json({ message: "Email already exists for another user" });
      }
      
      // Update the linked user's email
      if (employee.user_id) {
        await User.update(
          { email: req.body.email },
          { where: { id: employee.user_id } }
        );
        console.log("✅ User email updated");
      }
    }

    // If name is being updated, update it in the User table too
    if (req.body.name && employee.user_id) {
      await User.update(
        { name: req.body.name },
        { where: { id: employee.user_id } }
      );
    }

    // Update employee record
    await Employee.update(req.body, {
      where: { id }
    });

    res.json({ message: "Employee and user updated successfully" });
  } catch (err) {
    console.error("❌ Error updating employee:", err);
    res.status(500).json({ message: "Error updating employee", error: err.message });
  }
};


// Delete employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await Employee.destroy({ where: { id } });
  res.json({ message: "Employee deleted" });
};

exports.searchEmployees = async (req, res) => {
  try {
    const { name, department, designation, location, status } = req.query;

    const whereClause = {};

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (department) {
      whereClause.department = { [Op.like]: `%${department}%` };
    }

    if (designation) {
      whereClause.designation = { [Op.like]: `%${designation}%` };
    }

    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    if (status) {
      whereClause.status = status;
    }

    const employees = await Employee.findAll({
      where: whereClause,
      order: [["id", "DESC"]]
    });

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};
exports.sortEmployees = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC" } = req.query;

    const employees = await Employee.findAll({
      order: [[sortBy, order]]
    });

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sorting failed" });
  }
};
exports.getEmployeeWithDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: Document
    });

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employee documents" });
  }
};



exports.getEmployees = async (req, res) => {
  const { page = 1, limit = 5, sortBy = "name", order = "ASC" } = req.query;

  const employees = await Employee.findAll({
    where: { is_deleted: false },
    order: [[sortBy, order]],
    limit: +limit,
    offset: (page - 1) * limit
  });

  res.json(employees);
};

exports.getProfile = async (req, res) => {
  console.log("📋 Get profile called for user:", req.user.id);
  
  try {
    const userId = req.user.id;

    const profile = await Employee.findOne({
      where: { user_id: userId }
    });

    if (!profile) {
      console.log("❌ Profile not found for user:", userId);
      return res.status(404).json({ message: "Profile not found" });
    }

    console.log("✅ Profile found:", profile.name);
    res.json(profile);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};





// Update logged-in employee profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await Employee.update(req.body, {
      where: { user_id: userId }
    });

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};



