const { Task, Employee } = require("../models");

// Get tasks for logged-in employee
exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find employee by user_id
    const employee = await Employee.findOne({ where: { user_id: userId } });
    
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const tasks = await Task.findAll({
      where: { employee_id: employee.id },
      order: [["created_at", "DESC"]]
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Get all tasks (for Admin/HR)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'name', 'email']
      }],
      order: [["created_at", "DESC"]]
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Create task (Admin/HR assigns to employee)
exports.createTask = async (req, res) => {
  try {
    const { title, description, employee_id, priority, due_date } = req.body;
    
    const task = await Task.create({
      title,
      description,
      employee_id,
      priority,
      due_date,
      created_by: req.user.id,
      status: "Pending"
    });

    res.json({ message: "Task created successfully", task });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Task.update(
      { status },
      { where: { id } }
    );

    res.json({ message: "Task status updated" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Error updating task" });
  }
};

// Update task employee (only for pending tasks)
exports.updateTaskEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id } = req.body;

    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status === "Completed") {
      return res.status(400).json({ message: "Cannot reassign completed tasks" });
    }

    await Task.update(
      { employee_id },
      { where: { id } }
    );

    res.json({ message: "Task reassigned successfully" });
  } catch (err) {
    console.error("Error reassigning task:", err);
    res.status(500).json({ message: "Error reassigning task" });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Task.destroy({ where: { id } });
    
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
};
