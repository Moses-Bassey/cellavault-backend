const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('cng_conversions', 'userId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('cng_conversions', ['userId']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('cng_conversions', ['userId']);
    await queryInterface.removeColumn('cng_conversions', 'userId');
  },
};

