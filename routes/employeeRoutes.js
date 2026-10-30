const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");
const {
  addEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getProfile,
  updateProfile,
  sortEmployees
} = require("../controllers/employeeController");
router.post("/add", auth, roleAuth("Admin", "HR"), addEmployee);
router.get("/list", auth, roleAuth("Admin", "HR"), listEmployees);
router.put("/update/:id", auth, roleAuth("Admin", "HR"), updateEmployee);
router.delete("/delete/:id", auth, roleAuth("Admin"), deleteEmployee);
router.get("/profile", auth, getProfile);
// router.get("/profile", auth, role(["employee"]), getProfile);
router.put("/profile", auth, updateProfile);





router.get("/search",auth, roleAuth("Admin", "HR"), searchEmployees);
router.get("/test", (req, res) => {
  res.send("Employee route working!");
});
// router.get("/search", auth, role(["admin", "hr"]), searchEmployees);
router.get("/sort", auth, roleAuth("Admin", "HR"), sortEmployees);

module.exports = router;
