import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function signToken(user) {
  const payload = {
    sub: user.id,
    role: user.role,
    tokenVersion: user.token_version,
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
