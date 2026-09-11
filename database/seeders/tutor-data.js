"use strict";

const argon2 = require("argon2");

module.exports = {
  async up(queryInterface) {
    const passwordHash = await argon2.hash("testtutor1");

    await queryInterface.bulkInsert("tutors", [
      {
        id: "d9c8b36e-5f4a-4c28-98e3-0d5b4a1f6c7e",
        name: "Test Tutor",
        email: "danielokpa11@gmail.com",
        phone: "08106616246",
        password: passwordHash,
        role: "TUTOR",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      // {
      //   id: "b4d1c9f0-2a6e-4d3a-8c11-0a9f8e2d7b33",
      //   fullName: "Operations Admin",
      //   email: "ops@peppcruise.com",
      //   password: passwordHash,
      //   role: "SUPER_ADMIN",
      //   imageUrl: null,
      //   inviteStatus: "ACTIVE",
      //   isVerified: true,
      //   isActive: true,
      //   invitedAcceptedAt: new Date(),
      //   lastLogin: null,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   deletedAt: null,
      // },
    //   {
    //     id: "d91f0c2a-8b77-4e12-9c55-2a6d9f11c8a1",
    //     fullName: "Pending Admin",
    //     email: "pending@peppcruise.com",
    //     password: passwordHash,
    //     role: "ADMIN",
    //     inviteStatus: "PENDING",
    //     isVerified: false,
    //     isActive: false,
    //     lastLogin: null,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     deletedAt: null,
    //   },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("tutors", null, {});
  },
};