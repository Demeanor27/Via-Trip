import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { validate } from '../middleware/validate.js';
import { createTripSchema, updateTripSchema } from '../services/tripSchemas.js';
import * as tripService from '../services/tripService.js';
import { getDirections } from '../services/googleMaps.js';

const router = Router();

router.post('/', authenticate, validate(createTripSchema), async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.user.id, req.validated);
    res.status(201).json({ trip });
  } catch (err) {
    next(err);
  }
});

router.post('/directions', authenticate, async (req, res, next) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'origin and destination are required' });
    }
    const route = await getDirections(origin, destination);
    res.json({ route });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const trips = await tripService.getTripsByUser(req.user.id);
    res.json({ trips });
  } catch (err) {
    next(err);
  }
});

router.get('/shared/:token', optionalAuth, async (req, res, next) => {
  try {
    const trip = await tripService.getTripByShareToken(req.params.token);
    if (!trip) return res.status(404).json({ error: 'Trip not found or not shared' });
    res.json({ trip });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(parseInt(req.params.id), req.user.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ trip });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, validate(updateTripSchema), async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(parseInt(req.params.id), req.user.id, req.validated);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ trip });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const trip = await tripService.deleteTrip(parseInt(req.params.id), req.user.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post('/:id/share', authenticate, async (req, res, next) => {
  try {
    const result = await tripService.generateShareToken(parseInt(req.params.id), req.user.id);
    if (!result) return res.status(404).json({ error: 'Trip not found' });
    res.json({ shareToken: result.share_token });
  } catch (err) {
    next(err);
  }
});

export default router;
