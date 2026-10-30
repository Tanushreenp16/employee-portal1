const path = require("path");
const fs = require("fs");

const { Document, Employee, User } = require("../models");

/* =========================
   UPLOAD DOCUMENT
========================= */
exports.uploadDocument = async (req, res) => {
  try {
    let { employee_id } = req.body;
    
    // If no employee_id provided (employee uploading their own), find their employee record
    if (!employee_id) {
      const employee = await Employee.findOne({
        where: { user_id: req.user.id }
      });
      
      if (!employee) {
        return res.status(404).json({ message: "Employee record not found" });
      }
      
      employee_id = employee.id;
    }

    const doc = await Document.create({
      employee_id,
      document_name: req.file.originalname,
      file_path: req.file.path
    });

    res.json({ message: "Document uploaded successfully", doc });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

/* =========================
   GET MY DOCUMENTS
========================= */
exports.getMyDocuments = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { user_id: req.user.id }
    });

    if (!employee) return res.json([]);

    const docs = await Document.findAll({
      where: { employee_id: employee.id }
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

/* =========================
   GET ALL DOCUMENTS (ADMIN / HR)
========================= */
exports.allDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      include: {
        model: Employee,
        include: {
          model: User,
          attributes: ["name"]
        }
      }
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

/* =========================
   GET DOCUMENTS BY EMPLOYEE ID (ADMIN / HR)
========================= */
exports.getEmployeeDocuments = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const docs = await Document.findAll({
      where: { employee_id: employeeId }
    });

    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching documents" });
  }
};

/* =========================
   DOWNLOAD DOCUMENT
========================= */
exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);

    if (!doc)
      return res.status(404).json({ message: "Document not found" });

    // Check if user is Admin/HR or the document owner
    if (req.user.role !== "Admin" && req.user.role !== "HR") {
      const employee = await Employee.findOne({
        where: { user_id: req.user.id }
      });

      if (!employee || doc.employee_id !== employee.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const normalizedPath = doc.file_path.replace(/\\/g, "/");
    const filePath = path.join(__dirname, "..", normalizedPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }

    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
};

/* =========================
   DELETE DOCUMENT
========================= */
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);

    if (!doc)
      return res.status(404).json({ message: "Document not found" });

    // Check if user is Admin/HR or the document owner
    if (req.user.role !== "Admin" && req.user.role !== "HR") {
      const employee = await Employee.findOne({
        where: { user_id: req.user.id }
      });

      if (!employee || doc.employee_id !== employee.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    await Document.destroy({ where: { id: req.params.id } });

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
