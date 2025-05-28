import { Router } from 'express';
import { Callcard, Driver } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require auth
router.use(authenticate);

// GET /api/callcards - list
router.get('/', async (req, res) => {
  const cards = await Callcard.findAll({ include: Driver });
  res.json(cards);
});

// POST /api/callcards - create
router.post('/', async (req, res) => {
  try {
    const { title, pickupLocation, dropoffLocation } = req.body;
    const card = await Callcard.create({ title, pickupLocation, dropoffLocation });
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// GET /api/callcards/:id
router.get('/:id', async (req, res) => {
  const card = await Callcard.findByPk(req.params.id, { include: Driver });
  if (!card) return res.status(404).json({ message: 'Not found' });
  res.json(card);
});

// PUT /api/callcards/:id
router.put('/:id', async (req, res) => {
  const card = await Callcard.findByPk(req.params.id);
  if (!card) return res.status(404).json({ message: 'Not found' });
  await card.update(req.body);
  res.json(card);
});

// DELETE /api/callcards/:id
router.delete('/:id', async (req, res) => {
  const card = await Callcard.findByPk(req.params.id);
  if (!card) return res.status(404).json({ message: 'Not found' });
  await card.destroy();
  res.json({ message: 'Deleted' });
});

// POST /api/callcards/:id/assign
router.post('/:id/assign', async (req, res) => {
  const { driverId } = req.body;
  const card = await Callcard.findByPk(req.params.id);
  if (!card) return res.status(404).json({ message: 'Card not found' });
  const driver = await Driver.findByPk(driverId);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });

  await card.update({ driverId: driver.id, status: 'in_progress' });
  
  res.json(card);
});

// POST /api/callcards/:id/unassign
router.post('/:id/unassign', async (req, res) => {
  const card = await Callcard.findByPk(req.params.id);
  if (!card) return res.status(404).json({ message: 'Card not found' });
  await card.update({ driverId: null, status: 'pending' });
  res.json(card);
});

export default router;