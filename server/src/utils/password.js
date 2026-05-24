import bcrypt from 'bcrypt';
import crypto from 'crypto';
import env from '../config/env.js';

const MIN_COST = 10;

export async function hashPassword(password) {
  const cost = Math.max(env.BCRYPT_COST, MIN_COST);
  return bcrypt.hash(password, cost);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
