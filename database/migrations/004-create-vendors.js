const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('vendors', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      businessName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

      businessAddress: {
        type: DataTypes.STRING(500),
        allowNull: true,
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

    await queryInterface.addIndex('vendors', ['userId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('vendors');
  },
};