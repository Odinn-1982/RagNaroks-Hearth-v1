const jwt = require("jsonwebtoken");

// requireAuth: attaches req.user { userId, username, role }
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// requireRole('ADMIN') etc
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role === role || req.user.role === "OWNER" || req.user.role === "ADMIN") return next();
    return res.status(403).json({ error: "Forbidden" });
  };
}

module.exports = { requireAuth, requireRole };