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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_entity_1 = require("../entities/user.entity");
const sequelize_2 = require("sequelize");
const entities_1 = require("../../countries/entities");
let UserRepository = class UserRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByIdentity(identity) {
        return await this.userModel.findOne({
            where: {
                [sequelize_2.Op.or]: [
                    { email: identity },
                    { phoneNo: identity },
                ],
            },
            raw: true
        });
    }
    async findById(id) {
        return await this.userModel.findByPk(id, { raw: true });
    }
    async fetchUser(id) {
        const user = await this.userModel.findByPk(id, {
            attributes: {
                exclude: ['password', 'deletedAt', 'isDisabled'],
            },
            include: [
                {
                    model: entities_1.Country
                },
            ],
        });
        return user ? user.toJSON() : null;
    }
    async findByEmail(email) {
        const user = await this.userModel.findOne({
            where: { email },
        });
        return user ? user.toJSON() : null;
    }
    async findByPhone(phoneNo) {
        const user = await this.userModel.findOne({
            where: { phoneNo }
        });
        return user ? user.toJSON() : null;
    }
    async findByEmailAndRole(email, userType) {
        return await this.userModel.findOne({
            where: { email, userType },
            raw: true
        });
    }
    async create(userData) {
        const user = await this.userModel.create(userData, { raw: true, returning: true });
        return user.toJSON();
    }
    async update(id, userData) {
        return await this.userModel.update(userData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.userModel.destroy({
            where: { id },
        });
    }
    async restore(id) {
        await this.userModel.restore({
            where: { id },
        });
    }
    async findWithCountry(email, userType) {
        return await this.userModel.findOne({
            where: { email, userType },
            include: ['country'],
        });
    }
    async findAll(options) {
        return await this.userModel.findAll(options);
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __metadata("design:paramtypes", [Object])
], UserRepository);
//# sourceMappingURL=user.repository.js.map