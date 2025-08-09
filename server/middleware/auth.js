const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function auth(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing auth header' });
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = auth;
