import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

const files = fs.readdirSync(migrationsDir).sort();

async function run() {
  console.log('Running migrations...');

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`  Applying: ${file}`);
    await db.migrate(sql);
  }

  console.log('Migrations complete.');
  await db.end();
}

run().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
