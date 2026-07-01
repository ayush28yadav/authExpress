import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // The JWT is stored in a cookie named token.
  const token = req.cookies.token;

  // Debugging aid: log host/origin and whether the token cookie is present.
  // This prints only the cookie key names to avoid leaking the token value.
  console.log(`protect: host=${req.headers.host} origin=${req.headers.origin} cookies=${Object.keys(req.cookies)}`);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // protect() should already have attached the user before this runs.
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
      });
    }

    next();
  };
};
