"use strict";

const argon2 = require("argon2");

module.exports = {
  async up(queryInterface) {
    const passwordHash = await argon2.hash("linus.chiagozi@gmail.com");

    await queryInterface.bulkInsert("admins", [
    //   {
    //     id: "7c2d3f2e-9a1b-4a9d-9f5b-3f1c2a8d9e10",
    //     fullName: "Test Admin",
    //     email: "danielokpa11@gmail.com",
    //     phoneNo: "08106616246",
    //     password: passwordHash,
    //     role: "SUPER_ADMIN",
    //     imageUrl: null,
    //     inviteStatus: "ACTIVE",
    //     isVerified: true,
    //     isActive: true,
    //     invitedAcceptedAt: new Date(),
    //     lastLogin: null,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     deletedAt: null,
    //   },
      {
        id: "b4d1c9f0-2a6e-4d3a-8c11-0a9f8e2d7b33",
        fullName: "Chiagozi Linus",
        email: "linus.chiagozi@gmail.com",
        phoneNo: "07038355876",
        password: passwordHash,
        role: "SUPER_ADMIN",
        imageUrl: null,
        inviteStatus: "ACTIVE",
        isVerified: true,
        isActive: true,
        invitedAcceptedAt: new Date(),
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
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
    await queryInterface.bulkDelete("admins", null, {});
  },
};