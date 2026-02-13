'use strict';
const { QueryInterface } = require('sequelize');
const { randomUUID } = require('crypto');

const crypto = require('crypto');

function uuid() {
  return crypto.randomUUID();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function randomPastDateWithin(days) {
  const start = daysAgo(days).getTime();
  const end = Date.now();
  return new Date(randInt(start, end));
}

function moneyDecimalString(min, max) {
  // DECIMAL(10,2) stored as string for safety in MySQL bulkInsert
  const naira = randInt(min, max);
  const kobo = randInt(0, 99);
  return `${naira}.${String(kobo).padStart(2, '0')}`;
}

function decimalToKoboInt(decimalStr) {
  // "1234.50" -> 123450
  const [naira, kobo = '00'] = String(decimalStr).split('.');
  return Number(naira) * 100 + Number(kobo.padEnd(2, '0').slice(0, 2));
}

module.exports = {
  async up(queryInterface) {
    const DIALECT = queryInterface.sequelize.getDialect();
    if (DIALECT !== 'mysql' && DIALECT !== 'mariadb') {
      // Still works in many cases, but FK disabling below is MySQL-specific.
      // You can remove the FK disable bits if you aren't using FK constraints.
      console.warn(`[Seeder] Dialect is ${DIALECT}. FK disable is MySQL-specific.`);
    }

    const N_TRIPS = Number(process.env.SEED_TRIPS ?? 200);
    const N_USERS = Number(process.env.SEED_USERS ?? 25);
    const N_DRIVERS = Number(process.env.SEED_DRIVERS ?? 10);

    // --- Try to reuse existing users/drivers if present ---
    // If none exist, we generate UUIDs and (optionally) disable FK checks for seeding.
    let userIds = [];
    let driverIds = [];

    try {
      const [users] = await queryInterface.sequelize.query(
        'SELECT id FROM users LIMIT 5;',
      );
      userIds = (users || []).map((u) => u.id);
    } catch (_) {
      // table might not exist in this admin server schema; we'll fallback
      userIds = [];
    }

    try {
      const [drivers] = await queryInterface.sequelize.query(
        'SELECT id FROM drivers LIMIT 5;',
      );
      driverIds = (drivers || []).map((d) => d.id);
    } catch (_) {
      driverIds = [];
    }

    if (userIds.length === 0) {
      userIds = Array.from({ length: N_USERS }, () => uuid());
    }
    if (driverIds.length === 0) {
      driverIds = Array.from({ length: N_DRIVERS }, () => uuid());
    }

    // MySQL: optionally disable FK checks if your trips.userId has FK constraint
    // and you generated random userIds (no corresponding user records).
    const usingGeneratedUsers = userIds.length === N_USERS && N_USERS > 0;
    const usingGeneratedDrivers = driverIds.length === N_DRIVERS && N_DRIVERS > 0;

    if ((usingGeneratedUsers || usingGeneratedDrivers) && (DIALECT === 'mysql' || DIALECT === 'mariadb')) {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS=0;');
    }

    const TRIP_STATUSES = [
      'PENDING',
      'ASSIGNED',
      'ACCEPTED',
      'COMPLETED',
      'CANCELLED',
      'ON_THE_WAY',
      'ARRIVED',
    ];

    const PAYMENT_TYPES = ['PEPP_COIN', 'CASH', 'PI_COIN', 'CARD', 'WALLET'];

    const PLACE_NAMES = [
      "Mama's Cafe",
      "Marina Mall",
      "Airport Road",
      "University Gate",
      "City Stadium",
      "Main Park",
      "Central Market",
      "Hotel Avenue",
    ];

    const STREETS = [
      '11 Owokan Crescent, Wuse Zone 2, FCT',
      '14 Ahmadu Bello Way, Abuja, FCT',
      '5 Airport Road, Abuja, FCT',
      '20 Independence Ave, Lagos',
      '3 Marian Rd, Calabar',
    ];

    const now = new Date();

    const trips = [];
    const payments = [];
    const coins = [];

    for (let i = 0; i < N_TRIPS; i++) {
      const id = uuid();
      const userId = pick(userIds);

      // driverId allowed null; assign sometimes
      const driverId = Math.random() < 0.75 ? pick(driverIds) : null;

      // realistic-ish distribution
      const status = (() => {
        const r = Math.random();
        if (r < 0.55) return 'COMPLETED';
        if (r < 0.70) return 'CANCELLED';
        if (r < 0.80) return 'ON_THE_WAY';
        if (r < 0.88) return 'ACCEPTED';
        if (r < 0.94) return 'ASSIGNED';
        if (r < 0.97) return 'ARRIVED';
        return 'PENDING';
      })();

      const paymentType = pick(PAYMENT_TYPES);

      const createdAt = randomPastDateWithin(30);
      const startTime = status === 'COMPLETED' || status === 'CANCELLED' || Math.random() < 0.6
        ? new Date(createdAt.getTime() + randInt(5, 30) * 60_000)
        : null;

      const arrivalTime = startTime && (status === 'COMPLETED' || status === 'ARRIVED' || status === 'ON_THE_WAY')
        ? new Date(startTime.getTime() + randInt(5, 20) * 60_000)
        : null;

      const endTime = startTime && status === 'COMPLETED'
        ? new Date(startTime.getTime() + randInt(15, 55) * 60_000)
        : null;

      const estimatedFee = moneyDecimalString(300, 8000);

      const pickupLabel = pick(PLACE_NAMES);
      const dropoffLabel = pick(PLACE_NAMES);
      const pickupAddress = pick(STREETS);
      const dropoffAddress = pick(STREETS);

      trips.push({
        id,
        userId,
        driverId,
        estimatedFee, // DECIMAL string
        startTime,
        arrivalTime,
        endTime,
        paymentType,
        pickupAddress,
        dropoffAddress,
        pickupLocation: pickupLabel,
        dropoffLocation: dropoffLabel,
        pickupLatitude: null,
        pickupLongitude: null,
        dropoffLatitude: null,
        dropoffLongitude: null,
        status,
        createdAt,
        updatedAt: now,
        deletedAt: null,
      });

      // Create a payment record for most completed trips
      // and for some cancelled trips (failed/pending)
      if (status === 'COMPLETED' && Math.random() < 0.9) {
        payments.push({
          id: randomUUID(),
          passengerId: userId,
          amount: decimalToKoboInt(estimatedFee), // store in kobo
          status: 'SUCCESS',
          createdAt: endTime ?? createdAt,
          updatedAt: now,
        });

        // Coins logic (example):
        // - If paymentType PEPP_COIN, user spends coins (negative)
        // - Otherwise user earns small coins (positive)
        if (paymentType === 'PEPP_COIN') {
          coins.push({
            id: randomUUID(),
            passengerId: userId,
            delta: -randInt(20, 200),
            createdAt: endTime ?? createdAt,
            updatedAt: now,
          });
        } else {
          coins.push({
            id: randomUUID(),
            passengerId: userId,
            delta: randInt(1, 20),
            createdAt: endTime ?? createdAt,
            updatedAt: now,
          });
        }
      } else if (status === 'CANCELLED' && Math.random() < 0.25) {
        payments.push({
          id: randomUUID(),
          passengerId: userId,
          amount: decimalToKoboInt(estimatedFee),
          status: pick(['FAILED', 'PENDING']),
          createdAt,
          updatedAt: now,
        });
      }
    }

    // Bulk insert
    // NOTE: If trips already exist and IDs collide (unlikely with UUID), it will fail.
    await queryInterface.bulkInsert('trips', trips, {});

    // These tables are created by the migrations above
    await queryInterface.bulkInsert('payments', payments, {});
    await queryInterface.bulkInsert('coins', coins, {});

    if ((usingGeneratedUsers || usingGeneratedDrivers) && (DIALECT === 'mysql' || DIALECT === 'mariadb')) {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS=1;');
    }
  },

  async down(queryInterface) {
    // Remove only rows we inserted is harder without tagging.
    // For testing env, wiping is fine:
    await queryInterface.bulkDelete('coins', null, {});
    await queryInterface.bulkDelete('payments', null, {});
    // trips may be shared; if this is a dedicated test DB, you can wipe trips too:
    // await queryInterface.bulkDelete('trips', null, {});
  },
};
