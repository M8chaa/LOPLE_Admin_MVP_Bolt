import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !user.validatePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '8h',
    });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;