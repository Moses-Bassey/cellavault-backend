const { QueryInterface } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const countries = [
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'United Kingdom',
        phoneCode: '+44',
        flag: '🇬🇧',
        currency: 'GBP',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Canada',
        phoneCode: '+1',
        flag: '🇨🇦',
        currency: 'CAD',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Germany',
        phoneCode: '+49',
        flag: '🇩🇪',
        currency: 'EUR',
        phoneLength: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'France',
        phoneCode: '+33',
        flag: '🇫🇷',
        currency: 'EUR',
        phoneLength: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'Italy',
        phoneCode: '+39',
        flag: '🇮🇹',
        currency: 'EUR',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Spain',
        phoneCode: '+34',
        flag: '🇪🇸',
        currency: 'EUR',
        phoneLength: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Japan',
        phoneCode: '+81',
        flag: '🇯🇵',
        currency: 'JPY',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'China',
        phoneCode: '+86',
        flag: '🇨🇳',
        currency: 'CNY',
        phoneLength: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'India',
        phoneCode: '+91',
        flag: '🇮🇳',
        currency: 'INR',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Brazil',
        phoneCode: '+55',
        flag: '🇧🇷',
        currency: 'BRL',
        phoneLength: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        name: 'Australia',
        phoneCode: '+61',
        flag: '🇦🇺',
        currency: 'AUD',
        phoneLength: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440014',
        name: 'South Africa',
        phoneCode: '+27',
        flag: '🇿🇦',
        currency: 'ZAR',
        phoneLength: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440015',
        name: 'Kenya',
        phoneCode: '+254',
        flag: '🇰🇪',
        currency: 'KES',
        phoneLength: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440016',
        name: 'Ghana',
        phoneCode: '+233',
        flag: '🇬🇭',
        currency: 'GHS',
        phoneLength: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440017',
        name: 'Egypt',
        phoneCode: '+20',
        flag: '🇪🇬',
        currency: 'EGP',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440018',
        name: 'Morocco',
        phoneCode: '+212',
        flag: '🇲🇦',
        currency: 'MAD',
        phoneLength: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440019',
        name: 'Turkey',
        phoneCode: '+90',
        flag: '🇹🇷',
        currency: 'TRY',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        name: 'Russia',
        phoneCode: '+7',
        flag: '🇷🇺',
        currency: 'RUB',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const countriesToInsert = [];
    for (const country of countries) {
      const results = await queryInterface.sequelize.query(
        `SELECT id FROM countries WHERE id = '${country.id}' OR name = '${country.name}' LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      if (!results || results.length === 0) {
        countriesToInsert.push(country);
      }
    }

    if (countriesToInsert.length > 0) {
      await queryInterface.bulkInsert('countries', countriesToInsert);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('countries', null, {});
  },
};
