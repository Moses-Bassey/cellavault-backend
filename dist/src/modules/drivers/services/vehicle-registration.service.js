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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRegistrationService = void 0;
const common_1 = require("@nestjs/common");
const vehicle_registration_repository_1 = require("../repositories/vehicle-registration.repository");
const driver_service_1 = require("./driver.service");
let VehicleRegistrationService = class VehicleRegistrationService {
    vehicleRegistrationRepository;
    driverService;
    constructor(vehicleRegistrationRepository, driverService) {
        this.vehicleRegistrationRepository = vehicleRegistrationRepository;
        this.driverService = driverService;
    }
    async findById(id) {
        return await this.vehicleRegistrationRepository.findById(id);
    }
    async findByDriverId(driverId) {
        return await this.vehicleRegistrationRepository.findByDriverId(driverId);
    }
    async create(driverId, vehicleRegistrationData) {
        const driver = await this.driverService.findById(driverId);
        if (!driver) {
            throw new common_1.BadRequestException('Driver not found');
        }
        const existingVehicleRegistration = await this.vehicleRegistrationRepository.findByDriverId(driverId);
        if (existingVehicleRegistration.length > 0) {
            throw new common_1.BadRequestException('You can only have 1 vehicle registrations');
        }
        const data = await this.vehicleRegistrationRepository.create({
            vehicleRegisterationNo: vehicleRegistrationData.vehicleRegisterationNo,
            brandOfVehicle: vehicleRegistrationData.brandOfVehicle,
            color: vehicleRegistrationData.color,
            makeOfVehicle: vehicleRegistrationData.makeOfVehicle,
            vinNumber: vehicleRegistrationData.vinNumber,
            registerationExpiryDate: new Date(vehicleRegistrationData.registerationExpiryDate),
            plateNumberUrl: vehicleRegistrationData.plateNumberUrl,
            plateNo: vehicleRegistrationData.plateNo,
            driverId,
        });
        return vehicleRegistrationData;
    }
    async update(id, vehicleRegistrationData) {
        return await this.vehicleRegistrationRepository.update(id, vehicleRegistrationData);
    }
    async deleteVehicleRegistration(id, driverId) {
        const vehicleRegistration = await this.vehicleRegistrationRepository.findById(id);
        if (!vehicleRegistration) {
            throw new common_1.BadRequestException('Vehicle registration not found');
        }
        if (vehicleRegistration.driverId !== driverId) {
            throw new common_1.BadRequestException('Vehicle registration not found');
        }
        const data = await this.vehicleRegistrationRepository.deleteVehicleRegistration(id, driverId);
        return data;
    }
    async deleteByDriverId(driverId) {
        return await this.vehicleRegistrationRepository.deleteByDriverId(driverId);
    }
};
exports.VehicleRegistrationService = VehicleRegistrationService;
exports.VehicleRegistrationService = VehicleRegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vehicle_registration_repository_1.VehicleRegistrationRepository,
        driver_service_1.DriverService])
], VehicleRegistrationService);
//# sourceMappingURL=vehicle-registration.service.js.map