"use strict";

const argon2 = require("argon2");

module.exports = {
  async up(queryInterface) {
    const passwordHash = await argon2.hash("Admin@12345");
    const passwordHash1 = await argon2.hash("Vendor@12345");
    const passwordHash2 = await argon2.hash("Customer@12345");

    const now = new Date();

    const users = [
      {
        id: "7c2d3f2e-9a1b-4a9d-9f5b-3f1c2a8d9e10",
        email: "admin@cellarvault.com",
        emailVerifiedAt: now,
        phoneNo: "08010000001",
        phoneNoVerifiedAt: now,
        password: passwordHash,
        role: "ADMIN",
        isActive: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      {
        id: "8d3e4f3f-0b2c-4b9e-a06c-4a2d3b9e0f21",
        email: "vendor@cellarvault.com",
        emailVerifiedAt: now,
        phoneNo: "08010000002",
        phoneNoVerifiedAt: now,
        password: passwordHash1,
        role: "VENDOR",
        isActive: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      {
        id: "9e4f5a4a-1c3d-4c0f-b17d-5b3e4c0f1a32",
        email: "customer@cellarvault.com",
        emailVerifiedAt: now,
        phoneNo: "08010000003",
        phoneNoVerifiedAt: now,
        password: passwordHash2,
        role: "CUSTOMER",
        isActive: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ];

    await queryInterface.bulkInsert("users", users);

    await queryInterface.bulkInsert("admins", [
      {
        id: "a1b2c3d4-e5f6-4789-a012-b345c678d901",
        userId: "7c2d3f2e-9a1b-4a9d-9f5b-3f1c2a8d9e10",
        firstName: "Super",
        lastName: "Admin",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ]);

    await queryInterface.bulkInsert("vendors", [
      {
        id: "b2c3d4e5-f6a7-4890-b123-c456d789e012",
        userId: "8d3e4f3f-0b2c-4b9e-a06c-4a2d3b9e0f21",
        businessName: "Innovations Store",
        businessAddress: "Calabar, Cross River State",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ]);

    await queryInterface.bulkInsert("customers", [
      {
        id: "c3d4e5f6-a7b8-4901-c234-d567e890f123",
        userId: "9e4f5a4a-1c3d-4c0f-b17d-5b3e4c0f1a32",
        firstName: "John",
        lastName: "Doe",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("customers", {
      userId: "9e4f5a4a-1c3d-4c0f-b17d-5b3e4c0f1a32",
    });

    await queryInterface.bulkDelete("vendors", {
      userId: "8d3e4f3f-0b2c-4b9e-a06c-4a2d3b9e0f21",
    });

    await queryInterface.bulkDelete("admins", {
      userId: "7c2d3f2e-9a1b-4a9d-9f5b-3f1c2a8d9e10",
    });

    await queryInterface.bulkDelete("users", {
      id: [
        "7c2d3f2e-9a1b-4a9d-9f5b-3f1c2a8d9e10",
        "8d3e4f3f-0b2c-4b9e-a06c-4a2d3b9e0f21",
        "9e4f5a4a-1c3d-4c0f-b17d-5b3e4c0f1a32",
      ],
    });
  },
};