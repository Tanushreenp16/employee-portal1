const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));
app.use("/upload/documents", express.static("upload/documents"));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/employees", require("./routes/employeeRoutes"));
app.use("/documents", require("./routes/documentRoute"));
app.use("/users", userRoutes);

module.exports = app;   
