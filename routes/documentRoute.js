const express = require("express");
const router = express.Router();
const multer = require("multer");

const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

const {
  uploadDocument,
  getMyDocuments,
  allDocuments,
  getEmployeeDocuments,
  downloadDocument,
  deleteDocument
} = require("../controllers/documentController");

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* =========================
   ROUTES
========================= */

// Upload document (Admin / HR / Employee for their own docs)
router.post(
  "/upload",
  auth,
  upload.single("document"),
  uploadDocument
);

// Get logged-in user's documents
router.get("/my", auth, getMyDocuments);

// Get all documents (Admin / HR)
router.get("/all", auth, roleAuth("Admin", "HR"), allDocuments);

// Get documents for specific employee (Admin / HR)
router.get("/employee/:employeeId", auth, roleAuth("Admin", "HR"), getEmployeeDocuments);

// Download document
router.get("/download/:id", auth, downloadDocument);

// Delete document
router.delete("/delete/:id", auth, deleteDocument);

module.exports = router;
