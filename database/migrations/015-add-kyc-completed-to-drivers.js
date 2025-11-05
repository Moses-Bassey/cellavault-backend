const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('drivers', 'kycCompleted', {
        type: DataTypes.ENUM('PERSONAL_INFORMATION','IDENTITY_INFORMATION','RESIDENTIAL_INFORMATION','ALL_COMPLETED','NOT_COMPLETED'),
        allowNull: false,
        defaultValue: 'NOT_COMPLETED'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('drivers', 'kycCompleted');
  },
};

