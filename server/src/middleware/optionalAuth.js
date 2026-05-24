import db from '../config/db.js';
import { verifyToken } from '../utils/jwt.js';

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.split(' ')[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    req.user = null;
    return next();
  }

  try {
    const result = await db.query(
      'SELECT id, name, email, role, status, token_version FROM users WHERE id = $1 AND status = $2',
      [payload.sub, 'active']
    );
    req.user = result.rows[0] || null;
  } catch {
    req.user = null;
  }

  next();
}
