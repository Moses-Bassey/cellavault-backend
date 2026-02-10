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
const kyc_enums_1 = require("../../../enums/kyc.enums");
const state_service_1 = require("../../countries/services/state.service");
let KycService = class KycService {
    kyc1Repository;
    kyc2Repository;
    kyc3Repository;
    driverRepository;
    countryRepository;
    stateService;
    constructor(kyc1Repository, kyc2Repository, kyc3Repository, driverRepository, countryRepository, stateService) {
        this.kyc1Repository = kyc1Repository;
        this.kyc2Repository = kyc2Repository;
        this.kyc3Repository = kyc3Repository;
        this.driverRepository = driverRepository;
        this.countryRepository = countryRepository;
        this.stateService = stateService;
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
            return existingKyc1;
        }
        const kyc1 = await this.kyc1Repository.create({
            ...kycData,
            driverId,
            countryId: kycData.countryId,
            dateOfBirth: new Date(kycData.dateOfBirth),
        });
        if (kyc1.id) {
            await this.driverRepository.update(driverId, {
                kycCompleted: kyc_enums_1.KYC_COMPLETED.PERSONAL_INFORMATION,
            });
        }
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
            return existingKyc2;
        }
        const kyc2 = await this.kyc2Repository.create({
            ...kycData,
            driverId,
        });
        if (kyc2.id) {
            await this.driverRepository.update(driverId, {
                kycCompleted: kyc_enums_1.KYC_COMPLETED.IDENTITY_INFORMATION,
            });
        }
        return kyc2;
    }
    async createKyc3(driverId, kycData) {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const state = await this.stateService.findById(kycData.stateId);
        if (!state) {
            throw new common_1.NotFoundException('State not found');
        }
        const existingKyc3 = await this.kyc3Repository.findByDriverId(driverId);
        if (existingKyc3) {
            return existingKyc3;
        }
        const kyc3 = await this.kyc3Repository.create({
            ...kycData,
            driverId,
        });
        if (kyc3.id) {
            await this.driverRepository.update(driverId, {
                kycCompleted: kyc_enums_1.KYC_COMPLETED.RESIDENTIAL_INFORMATION,
            });
        }
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
        repositories_2.CountryRepository,
        state_service_1.StateService])
], KycService);
//# sourceMappingURL=kyc.service.js.map