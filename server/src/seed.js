import db from './config/db.js';
import { hashPassword } from './utils/password.js';

async function seed() {
  console.log('Seeding admin user...');

  const email = 'admin@viatrip.com';
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);

  if (existing.rows.length > 0) {
    console.log('Admin user already exists. Skipping.');
    await db.end();
    return;
  }

  const passwordHash = await hashPassword('Admin123!');
  await db.query(
    `INSERT INTO users (name, email, password_hash, role, status, token_version)
     VALUES ($1, $2, $3, $4, 'active', 0)`,
    ['Admin', email, passwordHash, 'admin']
  );

  console.log(`Admin user created: ${email}`);
  console.log('Default password: Admin123!');
  console.log('*** CHANGE THIS PASSWORD AFTER FIRST LOGIN ***');
  await db.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
