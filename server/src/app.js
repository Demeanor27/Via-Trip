import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { redact, redactLog } from './utils/redact.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, _req, res, _next) => {
  const safe = redact({ ...err, message: err.message, stack: err.stack });
  console.error('[ERROR]', JSON.stringify(redactLog([safe])));
  res.status(500).json({ error: 'Internal server error' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

export default app;
