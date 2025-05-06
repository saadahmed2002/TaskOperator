import jwt from 'jsonwebtoken';
import config from '../config/config';

export const verifyToken = (req) => {
  const token = req.cookies?.token || req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

  if (!token) throw new Error('Unauthorized');

  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};
