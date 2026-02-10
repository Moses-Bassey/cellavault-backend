const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Add adminId column
    await queryInterface.addColumn('client_devices', 'adminId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'admins', // assumes you have an "admins" table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add index for adminId
    await queryInterface.addIndex('client_devices', ['adminId']);

    // Update ENUM to include ADMIN
    await queryInterface.sequelize.query(`
      ALTER TABLE client_devices 
      MODIFY COLUMN userType ENUM('DRIVER', 'USER', 'SUPER_ADMIN', 'PEPP_ADMIN', 'PEPP_MANAGER') NULL
    `);
  },

  down: async (queryInterface) => {
    // Remove index and column
    await queryInterface.removeIndex('client_devices', ['adminId']);
    await queryInterface.removeColumn('client_devices', 'adminId');

    // Revert ENUM back to DRIVER and USER only
    await queryInterface.sequelize.query(`
      ALTER TABLE client_devices 
      MODIFY COLUMN userType ENUM('DRIVER', 'USER') NULL
    `);
  },
};
