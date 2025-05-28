import { Router } from 'express';
import { Driver, Callcard } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// GET /api/drivers
router.get('/', async (req, res) => {
  const drivers = await Driver.findAll();
  res.json(drivers);
});

// GET /api/drivers/:id
router.get('/:id', async (req, res) => {
  const driver = await Driver.findByPk(req.params.id, { include: Callcard });
  if (!driver) return res.status(404).json({ message: 'Not found' });
  res.json(driver);
});

// POST /api/drivers
router.post('/', async (req, res) => {
  try {
    const { name, status, phone, vehicleInfo } = req.body;
    const driver = await Driver.create({ name, status, phone, vehicleInfo });
    res.status(201).json(driver);
  } catch {
    res.status(400).json({ message: 'Invalid data' });
  }
});

export default router;