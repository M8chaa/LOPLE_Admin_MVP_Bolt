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
  } catch (err) {
    console.error('Driver creation error:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT /api/drivers/:id
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    
    await driver.update(req.body);
    res.json(driver);
  } catch (err) {
    console.error('Driver update error:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE /api/drivers/:id
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    
    // Check if driver is assigned to any callcards
    const assignedCallcards = await Callcard.findAll({ where: { driverId: driver.id } });
    if (assignedCallcards.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete driver with assigned callcards. Please unassign first.' 
      });
    }
    
    await driver.destroy();
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    console.error('Driver deletion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;