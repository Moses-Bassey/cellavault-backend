const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      replacedByTokenId: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      userAgent: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      ipAddress: {
        type: DataTypes.STRING(100),
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
    });

    await queryInterface.addIndex('refresh_tokens', ['userId']);
    await queryInterface.addIndex('refresh_tokens', ['expiresAt']);
    await queryInterface.addIndex('refresh_tokens', ['revokedAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('refresh_tokens');
  },
};