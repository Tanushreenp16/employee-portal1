const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "employee_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "Tanu@123",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.DB_LOGGING === 'true' || false
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ Database connected via ORM"))
  .catch(err => console.error("❌ ORM connection error:", err));

module.exports = sequelize;
