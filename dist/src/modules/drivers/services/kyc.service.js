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
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const kyc1_repository_1 = require("../repositories/kyc1.repository");
const kyc2_repository_1 = require("../repositories/kyc2.repository");
const kyc3_repository_1 = require("../repositories/kyc3.repository");
const repositories_1 = require("../repositories");
const repositories_2 = require("../../countries/repositories");
let KycService = class KycService {
    kyc1Repository;
    kyc2Repository;
    kyc3Repository;
    driverRepository;
    countryRepository;
    constructor(kyc1Repository, kyc2Repository, kyc3Repository, driverRepository, countryRepository) {
        this.kyc1Repository = kyc1Repository;
        this.kyc2Repository = kyc2Repository;
        this.kyc3Repository = kyc3Repository;
        this.driverRepository = driverRepository;
        this.countryRepository = countryRepository;
    }
    async createKyc1(driverId, kycData) {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const country = await this.countryRepository.findById(kycData.countryId);
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        const existingKyc1 = await this.fetchKyc1ByDriverId(driverId);
        if (existingKyc1) {
            throw new common_1.ConflictException('KYC1 (Personal Information) already exists for this driver');
        }
        const kyc1 = await this.kyc1Repository.create({
            ...kycData,
            driverId,
            countryId: kycData.countryId,
            dateOfBirth: new Date(kycData.dateOfBirth),
        });
        return kyc1;
    }
    async fetchKyc1ByDriverId(driverId) {
        return await this.kyc1Repository.findByDriverId(driverId);
    }
    async fetchKyc2ByDriverId(driverId) {
        return await this.kyc2Repository.findByDriverId(driverId);
    }
    async fetchKyc3ByDriverId(driverId) {
        return await this.kyc3Repository.findByDriverId(driverId);
    }
    async createKyc2(driverId, kycData) {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const existingKyc2 = await this.fetchKyc2ByDriverId(driverId);
        if (existingKyc2) {
            throw new common_1.ConflictException('KYC2 (ID Information) already exists for this driver');
        }
        const kyc2 = await this.kyc2Repository.create({
            ...kycData,
            driverId,
        });
        return kyc2;
    }
    async createKyc3(driverId, kycData) {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const existingKyc3 = await this.kyc3Repository.findByDriverId(driverId);
        if (existingKyc3) {
            throw new common_1.ConflictException('KYC3 (Residential Information) already exists for this driver');
        }
        const kyc3 = await this.kyc3Repository.create({
            ...kycData,
            driverId,
        });
        return kyc3;
    }
    async getAllKycByDriverId(driverId) {
        const [kyc1, kyc2, kyc3] = await Promise.all([
            this.kyc1Repository.findByDriverId(driverId),
            this.kyc2Repository.findByDriverId(driverId),
            this.kyc3Repository.findByDriverId(driverId),
        ]);
        return {
            kyc1,
            kyc2,
            kyc3,
        };
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kyc1_repository_1.Kyc1Repository,
        kyc2_repository_1.Kyc2Repository,
        kyc3_repository_1.Kyc3Repository,
        repositories_1.DriverRepository,
        repositories_2.CountryRepository])
], KycService);
//# sourceMappingURL=kyc.service.js.map