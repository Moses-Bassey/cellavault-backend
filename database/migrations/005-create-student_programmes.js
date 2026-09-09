const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('student_programmes', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      programmeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'programmes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.addIndex('student_programmes', ['studentId', 'programmeId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('student_programmes');
  },
};
