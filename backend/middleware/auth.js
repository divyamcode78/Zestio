const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

// Middleware to check if user owns the resource
const checkResourceOwnership = (resourceField = 'user_id') => {
  return async (req, res, next) => {
    try {
      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user owns the resource
      const resourceId = req.params.id || req.body[resourceField];
      if (req.user.id !== parseInt(resourceId)) {
        return res.status(403).json({ 
          error: 'Access denied. You can only access your own resources.' 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Error checking resource ownership' });
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkResourceOwnership
};
