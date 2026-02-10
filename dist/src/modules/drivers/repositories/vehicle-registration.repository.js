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
exports.VehicleRegistrationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const vehicle_registration_entity_1 = require("../entities/vehicle-registration.entity");
let VehicleRegistrationRepository = class VehicleRegistrationRepository {
    vehicleRegistrationModel;
    constructor(vehicleRegistrationModel) {
        this.vehicleRegistrationModel = vehicleRegistrationModel;
    }
    async findById(id) {
        return await this.vehicleRegistrationModel.findByPk(id, { raw: true });
    }
    async findByDriverId(driverId) {
        return await this.vehicleRegistrationModel.findAll({
            where: { driverId },
            raw: true,
        });
    }
    async create(vehicleRegistrationData) {
        const vehicleRegistration = await this.vehicleRegistrationModel.create(vehicleRegistrationData, { raw: true, returning: true });
        return vehicleRegistration.toJSON();
    }
    async update(id, vehicleRegistrationData) {
        return await this.vehicleRegistrationModel.update(vehicleRegistrationData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.vehicleRegistrationModel.destroy({
            where: { id },
        });
    }
    async deleteVehicleRegistration(id, driverId) {
        return await this.vehicleRegistrationModel.destroy({
            where: { id, driverId },
        });
    }
    async deleteByDriverId(driverId) {
        return await this.vehicleRegistrationModel.destroy({
            where: { driverId },
        });
    }
};
exports.VehicleRegistrationRepository = VehicleRegistrationRepository;
exports.VehicleRegistrationRepository = VehicleRegistrationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(vehicle_registration_entity_1.VehicleRegistration)),
    __metadata("design:paramtypes", [Object])
], VehicleRegistrationRepository);
//# sourceMappingURL=vehicle-registration.repository.js.map