const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "employee_db",     // DB name
  "root",            // username
  "Tanu@123",        // password
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);

// Import models
const User = require("./User")(sequelize);
const Employee = require("./Employee")(sequelize);
const Document = require("./Document")(sequelize);
const Task = require("./Task")(sequelize);

/* =====================
   MODEL RELATIONSHIPS
===================== */

// User → Employees
User.hasMany(Employee, { foreignKey: "user_id" });
Employee.belongsTo(User, { foreignKey: "user_id" });

// Employee → Documents
Employee.hasMany(Document, { foreignKey: "employee_id" });
Document.belongsTo(Employee, { foreignKey: "employee_id" });

// Employee → Tasks
Employee.hasMany(Task, { foreignKey: "employee_id" });
Task.belongsTo(Employee, { foreignKey: "employee_id" });
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");
  } catch (error) {
    console.error("DB error:", error);
  }
};

module.exports = {
  sequelize,
  User,
  Employee,
  Document,
  Task,
  syncDatabase
};

