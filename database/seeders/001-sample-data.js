const { QueryInterface } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Insert sample country data
    // Check if countries already exist before inserting to prevent duplicate errors
    const countriesToInsert = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Nigeria',
        phoneCode: '+234',
        flag: '🇳🇬',
        currency: 'NGN',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'United States',
        phoneCode: '+1',
        flag: '🇺🇸',
        currency: 'USD',
        phoneLength: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const filteredCountries = [];
    for (const country of countriesToInsert) {
      const results = await queryInterface.sequelize.query(
        `SELECT id FROM countries WHERE id = '${country.id}' OR name = '${country.name}' LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      // If no results found, add to filtered list
      if (!results || results.length === 0) {
        filteredCountries.push(country);
      }
    }

    if (filteredCountries.length > 0) {
      await queryInterface.bulkInsert('countries', filteredCountries);
    }

    // Insert sample user data
    // Check if user already exists before inserting to prevent duplicate errors
    const userToInsert = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      fullName: 'Admin User',
      phoneNo: '+2341234567890',
      email: 'admin@peppcruise.com',
      password: '$2b$10$example.hash.password', // This should be a real hashed password
      userType: 'PEPP_ADMIN',
      loginType: 'NORMAL',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      countryId: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE id = '${userToInsert.id}' OR email = '${userToInsert.email}' OR phoneNo = '${userToInsert.phoneNo}' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!existingUser || existingUser.length === 0) {
      await queryInterface.bulkInsert('users', [userToInsert]);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', {});
    await queryInterface.bulkDelete('countries', {});
  },
};
