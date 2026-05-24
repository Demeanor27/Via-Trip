import { config } from 'dotenv';
config();

const env = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_COST: parseInt(process.env.BCRYPT_COST, 10) || 12,
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  RESET_LINK_BASE: process.env.RESET_LINK_BASE || 'http://localhost:5173/reset-password',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
};

const REQUIRED = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of REQUIRED) {
  if (!env[key]) {
    console.error(`FATAL: Missing required env variable: ${key}`);
    process.exit(1);
  }
}

export default env;
