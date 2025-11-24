const { QueryInterface } = require('sequelize');
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface) => {
    const stations = [
      {
        id: randomUUID(),
        name: 'CNG Station Lagos Mainland',
        state: 'Lagos',
        country: 'Nigeria',
        longitude: 3.3792,
        latitude: 6.5244,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Ikeja',
        state: 'Lagos',
        country: 'Nigeria',
        longitude: 3.3487,
        latitude: 6.5244,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Victoria Island',
        state: 'Lagos',
        country: 'Nigeria',
        longitude: 3.4219,
        latitude: 6.4281,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Abuja Central',
        state: 'FCT',
        country: 'Nigeria',
        longitude: 7.4951,
        latitude: 9.0765,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Garki',
        state: 'FCT',
        country: 'Nigeria',
        longitude: 7.4951,
        latitude: 9.0579,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Port Harcourt',
        state: 'Rivers',
        country: 'Nigeria',
        longitude: 7.0025,
        latitude: 4.8156,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Kano',
        state: 'Kano',
        country: 'Nigeria',
        longitude: 8.5167,
        latitude: 12.0022,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Ibadan',
        state: 'Oyo',
        country: 'Nigeria',
        longitude: 3.8964,
        latitude: 7.3775,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Kaduna',
        state: 'Kaduna',
        country: 'Nigeria',
        longitude: 7.4388,
        latitude: 10.5264,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'CNG Station Enugu',
        state: 'Enugu',
        country: 'Nigeria',
        longitude: 7.4947,
        latitude: 6.4520,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const stationsToInsert = [];
    for (const station of stations) {
      const results = await queryInterface.sequelize.query(
        `SELECT id FROM cng_stations WHERE name = '${station.name}' LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (!results || results.length === 0) {
        stationsToInsert.push(station);
      }
    }

    if (stationsToInsert.length > 0) {
      await queryInterface.bulkInsert('cng_stations', stationsToInsert);
      console.log(`✅ Inserted ${stationsToInsert.length} CNG stations`);
    } else {
      console.log('ℹ️  All CNG stations already exist');
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('cng_stations', null, {});
  },
};

