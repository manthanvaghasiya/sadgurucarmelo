import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization header first (Bearer token — primary for SPAs & mobile)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Fallback to cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const secret = (process.env.JWT_SECRET || 'sadguru_super_secret_key_change_in_production').trim();
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('Not authorized, token failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not Authorized, token expired or invalid' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not Authorized, no token' });
};

export const admin = (req, res, next) => {
  console.log('🔍 Admin check — req.user:', JSON.stringify(req.user));
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as an admin or manager' });
};

export const strictAdmin = (req, res, next) => {
  console.log('🔍 Strict Admin check — req.user:', JSON.stringify(req.user));
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as a strict admin' });
};
