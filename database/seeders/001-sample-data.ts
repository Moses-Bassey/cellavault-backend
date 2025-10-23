import { QueryInterface } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Insert sample country data
    await queryInterface.bulkInsert('countries', [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Nigeria',
        phoneCode: '+234',
        flag: '🇳🇬',
        currency: 'NGN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'United States',
        phoneCode: '+1',
        flag: '🇺🇸',
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert sample user data
    await queryInterface.bulkInsert('users', [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        fullName: 'Admin User',
        phoneNo: '+2341234567890',
        email: 'admin@peppcruise.com',
        password: '$2b$10$example.hash.password', // This should be a real hashed password
        userType: 'PEPP_ADMIN',
        isEmailVerified: true,
        isPhoneVerified: true,
        isVerified: true,
        countryId: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('countries', null, {});
  },
};
