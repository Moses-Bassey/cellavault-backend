'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('programmes', [
      {
        id: uuidv4(),
        name: 'Web Development',
        description: 'A comprehensive 12-week program covering HTML, CSS, JavaScript, React, and Node.js.',
        hours: 360,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Data Science',
        description: 'Learn Python, SQL, data visualization, and foundational machine learning techniques.',
        hours: 240,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'UI/UX Design',
        description: 'Master user research, wireframing, prototyping, and design tools like Figma.',
        hours: 180,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Cybersecurity',
        description: 'Introduction to network security, ethical hacking, and threat mitigation strategy.',
        hours: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Deletes all seeded items by matching the specific names
    return queryInterface.bulkDelete('programmes', {
      name: [
        'Web Development Boot Camp',
        'Data Science Fundamentals',
        'UI/UX Design Masterclass',
        'Cybersecurity Essentials'
      ]
    }, {});
  }
};
