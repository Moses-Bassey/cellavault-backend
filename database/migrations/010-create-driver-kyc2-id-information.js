const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('driver_kyc_2_id_information', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      driverId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'drivers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      identificationType: {
        type: DataTypes.ENUM('NATIONAL_ID', 'PASSPORT', 'DRIVER_LICENSE', 'VOTER_CARD'),
        allowNull: false,
      },
      identificationNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      identificationImageUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Add index on driverId for better query performance
    await queryInterface.addIndex('driver_kyc_2_id_information', ['driverId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('driver_kyc_2_id_information');
  },
};

