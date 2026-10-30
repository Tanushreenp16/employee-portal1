const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

// Employee routes
router.get("/my-tasks", auth, taskController.getMyTasks);
router.put("/:id/status", auth, taskController.updateTaskStatus);

// Admin/HR routes
router.get("/all", auth, taskController.getAllTasks);
router.post("/create", auth, taskController.createTask);
router.put("/:id/employee", auth, taskController.updateTaskEmployee);
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
