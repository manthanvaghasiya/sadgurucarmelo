import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // First try to read token from cookies (Primary method for web clients)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Fallback support if API is ever accessed by mobile apps via headers
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

export const admin = (req, res, next) => {
  console.log('🔍 Admin check — req.user:', JSON.stringify(req.user));
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as an admin' });
};
