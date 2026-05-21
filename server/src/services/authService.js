import db from '../config/db.js';
import env from '../config/env.js';
import { hashPassword, verifyPassword, generateResetToken, hashResetToken } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export async function registerUser({ name, email, password, role }) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return { conflict: true };
  }

  const passwordHash = await hashPassword(password);
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role, status, token_version)
     VALUES ($1, $2, $3, $4, 'active', 0)
     RETURNING id, name, email, role, status`,
    [name, email, passwordHash, role]
  );

  const user = result.rows[0];
  const token = signToken(user);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return { user, token, expiresAt };
}

export async function loginUser({ email, password }) {
  const result = await db.query(
    'SELECT id, name, email, password_hash, role, status, token_version FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return { invalidCredentials: true };
  }

  const user = result.rows[0];

  if (user.status === 'deactivated') {
    return { deactivated: true };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { invalidCredentials: true };
  }

  const token = signToken(user);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    token,
    expiresAt,
  };
}

export async function getMe(userId) {
  const result = await db.query(
    'SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function forgotPassword(email) {
  const result = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    return;
  }

  const user = result.rows[0];
  const rawToken = generateResetToken();
  const tokenHash = hashResetToken(rawToken);

  await db.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 minutes')`,
    [user.id, tokenHash]
  );

  return { rawToken, email, name: user.name };
}

export async function resetPassword({ token, newPassword }) {
  const tokenHash = hashResetToken(token);

  const result = await db.query(
    `SELECT prt.id, prt.user_id
     FROM password_reset_tokens prt
     WHERE prt.token_hash = $1
       AND prt.used_at IS NULL
       AND prt.expires_at > NOW()`,
    [tokenHash]
  );

  if (result.rows.length === 0) {
    return { invalidToken: true };
  }

  const resetRow = result.rows[0];
  const passwordHash = await hashPassword(newPassword);

  await db.query('BEGIN');

  try {
    await db.query('UPDATE users SET password_hash = $1, token_version = token_version + 1 WHERE id = $2', [
      passwordHash,
      resetRow.user_id,
    ]);

    await db.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [resetRow.id]);

    await db.query('COMMIT');
    return { success: true };
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
}

export async function listUsers() {
  const result = await db.query(
    'SELECT id, name, email, role, status, token_version, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function updateUserStatus(userId, status) {
  const result = await db.query(
    `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, role, status, created_at, updated_at`,
    [status, userId]
  );
  return result.rows[0] || null;
}
