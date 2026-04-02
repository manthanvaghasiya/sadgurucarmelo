const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user payload to request
      req.user = decoded;

      return next();
    } catch (error) {
      console.error('Not authorized, token failed:', error);
      return res.status(401).json({ message: 'Not Authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not Authorized, no token' });
  }
};

module.exports = { protect };
