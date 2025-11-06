const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('driver_kyc_1_personal_information', 'countryId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add index on countryId for better query performance
    await queryInterface.addIndex('driver_kyc_1_personal_information', ['countryId']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('driver_kyc_1_personal_information', ['countryId']);
    await queryInterface.removeColumn('driver_kyc_1_personal_information', 'countryId');
  },
};

