const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id, // User ID
      role: decoded.role, // User role, e.g., 'admin', 'user'
    }; // Attach decoded token data
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;
