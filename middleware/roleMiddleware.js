// This middleware runs AFTER the 'protect' middleware.
// It checks if the logged-in user has the 'Admin' role.
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next(); // User is an admin, so proceed to the controller function
  } else {
    // The user is logged in, but is not an admin.
    // 403 Forbidden is the correct status code for this.
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// You can add other role checks here in the future as your app grows.
// For example:
export const doctorOnly = (req, res, next) => {
  if (req.user && req.user.role === "Doctor") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a doctor" });
  }
};
