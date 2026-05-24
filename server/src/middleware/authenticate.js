import db from '../config/db.js';
import { verifyToken } from '../utils/jwt.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization header' });
  }

  const token = header.split(' ')[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const result = await db.query(
    'SELECT id, name, email, role, status, token_version, created_at, updated_at FROM users WHERE id = $1',
    [payload.sub]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'User not found' });
  }

  const user = result.rows[0];

  if (user.status === 'deactivated') {
    return res.status(403).json({ error: 'Account deactivated', code: 'ACCOUNT_DEACTIVATED' });
  }

  if (user.token_version !== payload.tokenVersion) {
    return res.status(401).json({ error: 'Token outdated. Please log in again.' });
  }

  req.user = user;
  next();
}
