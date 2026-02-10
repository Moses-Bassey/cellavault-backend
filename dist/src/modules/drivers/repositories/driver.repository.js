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
exports.DriverRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const driver_entity_1 = require("../entities/driver.entity");
const sequelize_2 = require("sequelize");
const entities_1 = require("../../countries/entities");
const guarantor_entity_1 = require("../entities/guarantor.entity");
const kyc1_personal_Info_entity_1 = require("../entities/kyc1-personal-Info.entity");
const kyc2_Id_Information_entity_1 = require("../entities/kyc2-Id-Information.entity");
const kyc3_residential_Information_entity_1 = require("../entities/kyc3-residential-Information.entity");
let DriverRepository = class DriverRepository {
    driverModel;
    constructor(driverModel) {
        this.driverModel = driverModel;
    }
    async findByIdentity(identity) {
        const driver = await this.driverModel.findOne({
            where: {
                [sequelize_2.Op.or]: [{ email: identity }, { phoneNo: identity }],
            },
        });
        return driver ? driver.toJSON() : null;
    }
    async findById(id) {
        return await this.driverModel.findByPk(id, { raw: true });
    }
    async fetchDriver(id) {
        const driver = await this.driverModel.findByPk(id, {
            attributes: {
                exclude: ['password', 'deletedAt', 'isDisabled'],
            },
            include: [
                {
                    model: entities_1.Country,
                },
                {
                    model: guarantor_entity_1.Guarantor,
                },
                {
                    model: kyc1_personal_Info_entity_1.kyc1PersonalInfo,
                },
                {
                    model: kyc2_Id_Information_entity_1.kyc2IdInformation,
                },
                {
                    model: kyc3_residential_Information_entity_1.kyc3ResidentialInformation,
                },
            ],
        });
        return driver ? driver.toJSON() : null;
    }
    async findByEmail(email) {
        const driver = await this.driverModel.findOne({
            where: { email },
        });
        return driver ? driver.toJSON() : null;
    }
    async findByPhone(phoneNo) {
        const driver = await this.driverModel.findOne({
            where: { phoneNo },
        });
        return driver ? driver.toJSON() : null;
    }
    async findByEmailAndRole(email, userType) {
        const driver = await this.driverModel.findOne({
            where: { email, userType },
        });
        return driver ? driver.toJSON() : null;
    }
    async findActiveDrivers(kycCompleted) {
        return await this.driverModel.findAll({
            where: { kycCompleted },
        });
    }
    async create(driverData) {
        const driver = await this.driverModel.create(driverData, {
            raw: true,
            returning: true,
        });
        return driver.toJSON();
    }
    async update(id, driverData) {
        return await this.driverModel.update(driverData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.driverModel.destroy({
            where: { id },
        });
    }
    async restore(id) {
        await this.driverModel.restore({
            where: { id },
        });
    }
    async findWithCountry(email, userType) {
        return await this.driverModel.findOne({
            where: { email, userType },
            include: ['country'],
        });
    }
    async findAll(options) {
        return await this.driverModel.findAll(options);
    }
};
exports.DriverRepository = DriverRepository;
exports.DriverRepository = DriverRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [Object])
], DriverRepository);
//# sourceMappingURL=driver.repository.js.map