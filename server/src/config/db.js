import pg from 'pg';
import env from './env.js';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
  process.exit(1);
});

export default {
  query(text, params) {
    return pool.query(text, params);
  },
  pool,
  async migrate(sql) {
    const client = await pool.connect();
    try {
      await client.query(sql);
    } finally {
      client.release();
    }
  },
  async end() {
    await pool.end();
  },
};
