const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {

    await queryInterface.addColumn('client_devices', 'driverId', {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'drivers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      // Add index for driverId
      await queryInterface.addIndex('client_devices', ['driverId']);

    // Alter the ENUM column to only have DRIVER and USER
    // MySQL requires using MODIFY COLUMN to change ENUM values
    await queryInterface.sequelize.query(`
      ALTER TABLE client_devices 
      MODIFY COLUMN userType ENUM('DRIVER', 'USER') NULL
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('client_devices', ['driverId']);
    await queryInterface.removeColumn('client_devices', 'driverId');
  },
};

