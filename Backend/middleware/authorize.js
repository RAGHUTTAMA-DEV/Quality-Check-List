import jwt from 'jsonwebtoken';
import UserModel from '../models/UserSchema.js';

// Reusable Role-Based Middleware
export function authorize(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized - user not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
      }

      req.user = user; // attach full user object to request
      next();

    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Unauthorized - middleware issue' });
    }
  };
}
