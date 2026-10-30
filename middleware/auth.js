// authMiddleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "employee-portal-local-secret";

module.exports = (req, res, next) => {
  console.log("🔐 Auth middleware called for:", req.method, req.path);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("❌ No authorization header");
    return res.status(401).json({ message: "Token missing" });
  }

  // Accept both "Bearer <token>" and raw token
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    console.log("✅ Token valid, user:", decoded);
    next();
  } catch (err) {
    console.log("❌ Token invalid:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
