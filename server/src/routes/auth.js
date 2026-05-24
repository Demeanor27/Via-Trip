import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../services/schemas.js';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} from '../services/authService.js';
import { sendResetEmail } from '../services/emailService.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const result = await registerUser(req.validated);
    if (result.conflict) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(201).json({
      user: result.user,
      token: result.token,
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const result = await loginUser(req.validated);
    if (result.invalidCredentials) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (result.deactivated) {
      return res.status(403).json({ error: 'Account deactivated', code: 'ACCOUNT_DEACTIVATED' });
    }
    res.json({
      user: result.user,
      token: result.token,
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authenticate, (_req, res) => {
  res.status(204).end();
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await getMe(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const result = await forgotPassword(req.validated.email);
    if (result) {
      await sendResetEmail(result);
    }
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', authLimiter, validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const result = await resetPassword(req.validated);
    if (result.invalidToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
