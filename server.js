const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", require("./routes/userRoutes"));
app.use("/employees", require("./routes/employeeRoutes"));
app.use("/documents", require("./routes/documentRoute"));
app.use("/tasks", require("./routes/taskRoutes"));

// Pages in frontend/. Open http://localhost:4000
app.use(express.static(path.join(__dirname, "frontend")));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: err.message,
    stack: err.stack 
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

const PORT = process.env.PORT || 4000;

// Start server ONLY after DB connects
sequelize.authenticate()
  .then(() => {
    console.log("Database connected");

    return sequelize.sync();
  })
  .then(() => sequelize.query(
    "ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL"
  ))
  .then(() => {
    console.log("✅ ORM models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Server failed to start:", err);
  });

