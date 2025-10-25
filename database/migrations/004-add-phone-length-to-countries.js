const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('countries', 'phoneLength', {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null initially for existing records
      defaultValue: null,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('countries', 'phoneLength');
  },
};
