import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import callcardRoutes from './routes/callcards.js';
import driverRoutes from './routes/drivers.js';
import { initSampleData } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'LOPLE Admin Backend running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/callcards', callcardRoutes);
app.use('/api/drivers', driverRoutes);

async function start() {
  try {
    await sequelize.sync();
    await initSampleData();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

start();