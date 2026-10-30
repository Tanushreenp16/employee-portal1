module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("🔒 Role auth check - User role:", req.user?.role, "Allowed:", allowedRoles);
    
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log("❌ Access denied");
      return res.status(403).json({ message: "Access denied" });
    }
    
    console.log("✅ Role authorized");
    next();
  };
};
