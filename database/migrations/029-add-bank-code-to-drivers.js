const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('drivers', 'bankCode', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('drivers', 'bankCode');
  },
};

