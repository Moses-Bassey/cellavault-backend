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
exports.CngConversionService = void 0;
const common_1 = require("@nestjs/common");
const cng_conversion_repository_1 = require("../repositories/cng-conversion.repository");
const engine_condition_enum_1 = require("../../../enums/engine-condition.enum");
const fuel_type_enum_1 = require("../../../enums/fuel-type.enum");
const transmission_enum_1 = require("../../../enums/transmission.enum");
const cng_conversion_status_enum_1 = require("../../../enums/cng-conversion-status.enum");
const user_service_1 = require("../../users/services/user.service");
const user_type_enum_1 = require("../../../enums/user-type.enum");
let CngConversionService = class CngConversionService {
    cngConversionRepository;
    userService;
    constructor(cngConversionRepository, userService) {
        this.cngConversionRepository = cngConversionRepository;
        this.userService = userService;
    }
    fetchTransmission() {
        const transmissions = Object.values(transmission_enum_1.TRANSMISSION);
        const fuelTypes = Object.values(fuel_type_enum_1.FUEL_TYPE);
        const engine_condition = Object.values(engine_condition_enum_1.ENGINE_CONDITION);
        return {
            transmissions,
            fuelTypes,
            engine_condition,
        };
    }
    async fetchUserCngConversions(userId, page, limit) {
        try {
            const offset = (page - 1) * limit;
            const conversions = await this.cngConversionRepository.findAll({
                where: {
                    userId: userId,
                },
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset,
            });
            return {
                fetchTransmission: await this.fetchTransmission(),
                conversions,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async fetchUserCngConversionsStats(userId) {
        try {
            const pending = await this.cngConversionRepository.count({
                where: {
                    userId: userId,
                    status: cng_conversion_status_enum_1.CNG_CONVERSION_STATUS.PENDING,
                },
            });
            const completed = await this.cngConversionRepository.count({
                where: {
                    userId: userId,
                    status: cng_conversion_status_enum_1.CNG_CONVERSION_STATUS.APPROVED,
                },
            });
            return {
                pending: pending,
                completed: completed,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findById(id) {
        return await this.cngConversionRepository.findById(id);
    }
    async findAll() {
        return await this.cngConversionRepository.findAll();
    }
    async create(userId, userType, cngConversionData) {
        try {
            let validUserId = undefined;
            if (userType === user_type_enum_1.UserType.USER) {
                const user = await this.userService.fetchUser(userId);
                if (!user) {
                    throw new common_1.NotFoundException('User not found');
                }
                validUserId = userId;
            }
            const data = await this.cngConversionRepository.create({
                fullName: cngConversionData.fullName,
                userId: validUserId,
                email: cngConversionData.email,
                contactPhone: cngConversionData.contactPhone,
                nin: cngConversionData.nin,
                vehicleRegisterationNo: cngConversionData.vehicleRegisterationNo,
                brandOfVehicle: cngConversionData.brandOfVehicle,
                color: cngConversionData.color,
                makeOfVehicle: cngConversionData.makeOfVehicle,
                yearOfManufacture: cngConversionData.yearOfManufacture,
                vinNumber: cngConversionData.vinNumber,
                registerationExpiryDate: new Date(cngConversionData.registerationExpiryDate),
                engineCapacity: cngConversionData.engineCapacity,
                cylinder: cngConversionData.cylinder,
                engineCondition: cngConversionData.engineCondition,
                fuelType: cngConversionData.fuelType,
                transmission: cngConversionData.transmission,
                mileage: cngConversionData.mileage,
                usualRoute: cngConversionData.usualRoute,
                operatingMotorPark: cngConversionData.operatingMotorPark,
                conversionCenter: cngConversionData.conversionCenter,
                residentialState: cngConversionData.residentialState,
                lga: cngConversionData.lga,
                address: cngConversionData.address,
                additionalNote: cngConversionData.additionalNote,
            });
            return cngConversionData;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async update(id, cngConversionData) {
        return await this.cngConversionRepository.update(id, cngConversionData);
    }
};
exports.CngConversionService = CngConversionService;
exports.CngConversionService = CngConversionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cng_conversion_repository_1.CngConversionRepository,
        user_service_1.UserService])
], CngConversionService);
//# sourceMappingURL=cng-conversion.service.js.map