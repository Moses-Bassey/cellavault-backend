const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('drivers', 'licenseImageUrl', {
      type: DataTypes.STRING(1000),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('drivers', 'licenseImageUrl');
  },
};