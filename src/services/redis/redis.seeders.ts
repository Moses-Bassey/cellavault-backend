import 'dotenv/config'; // loads .env automatically
import Redis from 'ioredis';
import { Driver } from './redis.types';
import { REDIS_DRIVER_KEY } from './redis.constants';

// import { RedisService } from './services/redis.service';
// import { Driver } from './redis.types';

async function seedDrivers() {
  // Initialize Redis client directly
  const redisUrl =
    process.env.REDIS_URL ||
    'redis://default:Hm8FrOgeE2s328c9BbkaqwvvFxmB9tFy@redis-11210.c270.us-east-1-3.ec2.cloud.redislabs.com:11210';
  const client = new Redis(redisUrl);

  console.log('Redis url:', redisUrl);
  // const redisService = new RedisService();

  // Calabar center: 4.9588, 8.3269
  const drivers: Driver[] = [
    {
      // id: 'driver-001',
      id: 'ce2aea6a-c68f-11f0-9044-9c7bef113580',
      latitude: 4.9601,
      longitude: 8.3225,
      isAvailable: true,
    },
    {
      // id: 'driver-002',
      id: '0ce40ff3-cecc-11f0-9b76-9c7bef113580',
      latitude: 4.9557,
      longitude: 8.3302,
      isAvailable: true,
    },
    {
      // id: 'driver-003',
      id: '0d232dd0-cecc-11f0-9b76-9c7bef113580',
      latitude: 4.9623,
      longitude: 8.3281,
      isAvailable: true,
    },
    {
      /*id: 'driver-004',*/
      id: '0d2341ee-cecc-11f0-9b76-9c7bef113580',
      latitude: 4.9579,
      longitude: 8.325,
      isAvailable: true,
    },
    {
      // id: 'driver-005',
      id: '0d234d4a-cecc-11f0-9b76-9c7bef113580',
      latitude: 4.9615,
      longitude: 8.3298,
      isAvailable: true,
    },
    {
      // id: 'driver-006',
      id: '385bc93d-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9548,
      longitude: 8.3274,
      isAvailable: true,
    },
    {
      // id: 'driver-007',
      id: '385bebc5-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9592,
      longitude: 8.3315,
      isAvailable: true,
    },
    {
      // id: 'driver-008',
      id: '385bf8e7-cece-11f0-9b76-9c7bef113580',
      latitude: 4.963,
      longitude: 8.3247,
      isAvailable: true,
    },
    {
      // id: 'driver-009',
      id: '385c0072-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9564,
      longitude: 8.3229,
      isAvailable: true,
    },
    {
      // id: 'driver-010',
      id: '385c0966-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9641,
      longitude: 8.327,
      isAvailable: true,
    },
    {
      // id: 'driver-011',
      id: '385c1157-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9582,
      longitude: 8.3333,
      isAvailable: true,
    },
    {
      // id: 'driver-012',
      id: '385c19a0-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9529,
      longitude: 8.3288,
      isAvailable: true,
    },
    {
      // id: 'driver-013',
      id: '385c315d-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9655,
      longitude: 8.3261,
      isAvailable: true,
    },
    {
      // id: 'driver-014',
      id: '385c4c26-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9597,
      longitude: 8.3204,
      isAvailable: true,
    },
    {
      // id: 'driver-015',
      id: '385c5a4f-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9571,
      longitude: 8.3342,
      isAvailable: true,
    },
    {
      // id: 'driver-016',
      id: '385c628b-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9628,
      longitude: 8.332,
      isAvailable: true,
    },
    {
      // id: 'driver-017',
      id: '385c694e-cece-11f0-9b76-9c7bef113580',
      latitude: 4.955,
      longitude: 8.3241,
      isAvailable: true,
    },
    {
      // id: 'driver-018',
      id: '385c717a-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9619,
      longitude: 8.3217,
      isAvailable: true,
    },
    {
      // id: 'driver-019',
      id: '385c789e-cece-11f0-9b76-9c7bef113580',
      latitude: 4.9536,
      longitude: 8.3299,
      isAvailable: true,
    },
    {
      // id: 'driver-020',
      id: '0d2355f6-cecc-11f0-9b76-9c7bef113580',
      latitude: 4.9662,
      longitude: 8.3284,
      isAvailable: true,
    },
  ];

  try {
    for (const driver of drivers) {
      await client.hset(REDIS_DRIVER_KEY, driver.id, JSON.stringify(driver));
      // await redisService.addOrUpdateDriver(driver);
    }

    console.log('✅ 20 Drivers seeded into Redis around Calabar');
  } catch (error) {
    console.error('❌ Failed to seed drivers into Redis:', error);
  } finally {
    process.exit(0);
  }
}

seedDrivers();

// import 'dotenv/config'; // loads .env automatically
// import Redis from 'ioredis';
// import { Driver } from './redis.types';
// import { REDIS_DRIVER_KEY } from './redis.constants';

// async function seedDrivers() {
//   // Initialize Redis client directly
//   const redisUrl = process.env.REDIS_URL || 'redis://default:Hm8FrOgeE2s328c9BbkaqwvvFxmB9tFy@redis-11210.c270.us-east-1-3.ec2.cloud.redislabs.com:11210';
//   const client = new Redis(redisUrl);

//   console.log('Redis url:', redisUrl);

//   const drivers: Driver[] = [
//     { id: 'driver-001', latitude: 4.9601, longitude: 8.3225, isAvailable: true },
//     { id: 'driver-002', latitude: 4.9557, longitude: 8.3302, isAvailable: true },
//     { id: 'driver-003', latitude: 4.9623, longitude: 8.3281, isAvailable: true },
//     { id: 'driver-004', latitude: 4.9579, longitude: 8.3250, isAvailable: true },
//     { id: 'driver-005', latitude: 4.9615, longitude: 8.3298, isAvailable: true },
//     { id: 'driver-006', latitude: 4.9548, longitude: 8.3274, isAvailable: true },
//     { id: 'driver-007', latitude: 4.9592, longitude: 8.3315, isAvailable: true },
//     { id: 'driver-008', latitude: 4.9630, longitude: 8.3247, isAvailable: true },
//     { id: 'driver-009', latitude: 4.9564, longitude: 8.3229, isAvailable: true },
//     { id: 'driver-010', latitude: 4.9641, longitude: 8.3270, isAvailable: true },
//     { id: 'driver-011', latitude: 4.9582, longitude: 8.3333, isAvailable: true },
//     { id: 'driver-012', latitude: 4.9529, longitude: 8.3288, isAvailable: true },
//     { id: 'driver-013', latitude: 4.9655, longitude: 8.3261, isAvailable: true },
//     { id: 'driver-014', latitude: 4.9597, longitude: 8.3204, isAvailable: true },
//     { id: 'driver-015', latitude: 4.9571, longitude: 8.3342, isAvailable: true },
//     { id: 'driver-016', latitude: 4.9628, longitude: 8.3320, isAvailable: true },
//     { id: 'driver-017', latitude: 4.9550, longitude: 8.3241, isAvailable: true },
//     { id: 'driver-018', latitude: 4.9619, longitude: 8.3217, isAvailable: true },
//     { id: 'driver-019', latitude: 4.9536, longitude: 8.3299, isAvailable: true },
//     { id: 'driver-020', latitude: 4.9662, longitude: 8.3284, isAvailable: true },
//   ];

//   try {
//     for (const driver of drivers) {
//       await client.hset(REDIS_DRIVER_KEY, driver.id, JSON.stringify(driver));
//     }
//     console.log('✅ 20 Drivers seeded into Redis around Calabar');
//   } catch (error) {
//     console.error('❌ Failed to seed drivers into Redis:', error);
//   } finally {
//     await client.quit();
//     process.exit(0);
//   }
// }

// seedDrivers();
