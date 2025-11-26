const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('guarantors', 'status', {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('guarantors', 'status');
  },
};



