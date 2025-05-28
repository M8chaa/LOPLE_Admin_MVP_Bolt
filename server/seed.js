import { User, Driver, Callcard } from './models/index.js';

export async function initSampleData() {
  const userCount = await User.count();
  if (userCount === 0) {
    await User.create({ username: 'admin', password: 'admin123' });
  }

  const driverCount = await Driver.count();
  if (driverCount === 0) {
    await Driver.bulkCreate([
      { name: 'Driver Kim', status: 'available', phone: '010-1111-2222' },
      { name: 'Driver Lee', status: 'available', phone: '010-3333-4444' },
    ]);
  }

  const cardCount = await Callcard.count();
  if (cardCount === 0) {
    await Callcard.bulkCreate([
      {
        title: 'Callcard 1',
        pickupLocation: 'Seoul',
        dropoffLocation: 'Busan',
        status: 'pending',
      },
      {
        title: 'Callcard 2',
        pickupLocation: 'Incheon',
        dropoffLocation: 'Daegu',
        status: 'pending',
      },
    ]);
  }
}