import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import { updateStatusSchema } from '../services/schemas.js';
import { listUsers, updateUserStatus } from '../services/authService.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/users', async (_req, res, next) => {
  try {
    const users = await listUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id/status', validate(updateStatusSchema), async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await updateUserStatus(userId, req.validated.status);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
