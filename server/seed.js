import { User, Driver, Callcard } from './models/index.js';

export async function initSampleData() {
  const userCount = await User.count();
  if (userCount === 0) {
    await User.create({ username: 'admin', password: 'admin123' });
  }

  const driverCount = await Driver.count();
  if (driverCount === 0) {
    await Driver.bulkCreate([
      { name: '김기사', status: 'available', phone: '010-1234-5678' },
      { name: '이기사', status: 'available', phone: '010-2345-6789' },
      { name: '박기사', status: 'busy', phone: '010-3456-7890' },
      { name: '최기사', status: 'available', phone: '010-4567-8901' },
    ]);
  }

  const cardCount = await Callcard.count();
  if (cardCount === 0) {
    await Callcard.bulkCreate([
      {
        title: '서울 → 부산 물류운송',
        pickupLocation: '서울특별시 강남구 테헤란로 123',
        dropoffLocation: '부산광역시 해운대구 센텀중앙로 79',
        status: 'pending',
      },
      {
        title: '인천 → 대구 배송건',
        pickupLocation: '인천광역시 연수구 송도과학로 123',
        dropoffLocation: '대구광역시 수성구 동대구로 123',
        status: 'pending',
      },
      {
        title: '경기 → 광주 운송',
        pickupLocation: '경기도 성남시 분당구 판교역로 166',
        dropoffLocation: '광주광역시 서구 상무중앙로 61',
        status: 'in_progress',
        driverId: 3,
      },
      {
        title: '서울 → 대전 긴급배송',
        pickupLocation: '서울특별시 마포구 월드컵북로 396',
        dropoffLocation: '대전광역시 유성구 대학로 99',
        status: 'pending',
      },
    ]);
  }
}