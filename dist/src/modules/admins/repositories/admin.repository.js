"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const admin_entity_1 = require("../entities/admin.entity");
let AdminRepository = class AdminRepository {
    adminModel;
    constructor(adminModel) {
        this.adminModel = adminModel;
    }
    async create(adminData) {
        try {
            return await this.adminModel.create(adminData);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error creating admin: ${error.message}`);
                throw new Error(`Error creating admin: ${error.message}`);
            }
            else {
                console.error(`Error creating admin: ${error}`);
                throw new Error(`Error creating admin: ${error}`);
            }
        }
    }
    async findById(id) {
        try {
            return await this.adminModel.findByPk(id);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding admin by ID: ${error.message}`);
                throw new Error(`Error finding admin by ID: ${error.message}`);
            }
            else {
                console.error(`Error finding admin by ID: ${error}`);
                throw new Error(`Error finding admin by ID: ${error}`);
            }
        }
    }
    async findByEmail(email) {
        try {
            return await this.adminModel.findOne({
                where: { email },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding admin by email: ${error.message}`);
                throw new Error(`Error finding admin by email: ${error.message}`);
            }
            else {
                console.error(`Error finding admin by email: ${error}`);
                throw new Error(`Error finding admin by email: ${error}`);
            }
        }
    }
    async findAll(options) {
        try {
            return await this.adminModel.findAll({
                limit: options?.limit ?? 10,
                offset: options?.offset ?? 0,
                order: [['createdAt', 'DESC']],
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding all admins: ${error.message}`);
                throw new Error(`Error finding all admins: ${error.message}`);
            }
            else {
                console.error(`Error finding all admins: ${error}`);
                throw new Error(`Error finding all admins: ${error}`);
            }
        }
    }
    async update(id, updates) {
        try {
            return await this.adminModel.update(updates, {
                where: { id },
                returning: true,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error updating admin: ${error.message}`);
                throw new Error(`Error updating admin: ${error.message}`);
            }
            else {
                console.error(`Error updating admin: ${error}`);
                throw new Error(`Error updating admin: ${error}`);
            }
        }
    }
    async delete(id) {
        try {
            return await this.adminModel.destroy({
                where: { id },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error deleting admin: ${error.message}`);
                throw new Error(`Error deleting admin: ${error.message}`);
            }
            else {
                console.error(`Error deleting admin: ${error}`);
                throw new Error(`Error deleting admin: ${error}`);
            }
        }
    }
    async restore(id) {
        try {
            return await this.adminModel.restore({
                where: { id },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error restoring admin: ${error.message}`);
                throw new Error(`Error restoring admin: ${error.message}`);
            }
            else {
                console.error(`Error restoring admin: ${error}`);
                throw new Error(`Error restoring admin: ${error}`);
            }
        }
    }
};
exports.AdminRepository = AdminRepository;
exports.AdminRepository = AdminRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [Object])
], AdminRepository);
//# sourceMappingURL=admin.repository.js.map