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
exports.GuarantorService = void 0;
const common_1 = require("@nestjs/common");
const guarantor_repository_1 = require("../repositories/guarantor.repository");
const country_service_1 = require("../../countries/services/country.service");
const driver_service_1 = require("./driver.service");
const guarantor_status_enum_1 = require("../../../enums/guarantor-status.enum");
const utils_1 = require("../../../utils/utils");
const validators_utils_1 = require("../../../utils/validators.utils");
let GuarantorService = class GuarantorService {
    guarantorRepository;
    countryService;
    driverService;
    MAX_GUARANTORS = 2;
    constructor(guarantorRepository, countryService, driverService) {
        this.guarantorRepository = guarantorRepository;
        this.countryService = countryService;
        this.driverService = driverService;
    }
    async findById(id) {
        return await this.guarantorRepository.findById(id);
    }
    async findByDriverId(driverId) {
        return await this.guarantorRepository.findByDriverId(driverId);
    }
    async countByDriverId(driverId) {
        return await this.guarantorRepository.countByDriverId(driverId);
    }
    async create(driverId, guarantorData) {
        try {
            const count = await this.guarantorRepository.countByDriverId(driverId);
            const driver = await this.driverService.findById(driverId);
            if (!driver) {
                throw new common_1.BadRequestException('Driver not found');
            }
            if (count > this.MAX_GUARANTORS) {
                throw new common_1.BadRequestException(`Maximum of ${this.MAX_GUARANTORS} guarantors allowed per driver`);
            }
            const country = await this.countryService.findById(guarantorData.country);
            if (!country) {
                throw new common_1.BadRequestException('Country not found');
            }
            if (guarantorData.phoneNo.length !== country.phoneLength) {
                throw new common_1.BadRequestException(`Phone number must be exactly ${country.phoneLength} digits`);
            }
            const phone = utils_1.Utils.normalizeCountryPhone(country.phoneCode, guarantorData.phoneNo, country.phoneLength);
            const email = validators_utils_1.Validators.validateEmail(guarantorData.email);
            if (driver.email == email || driver.phoneNo == phone) {
                throw new common_1.BadRequestException("You cannot be a guarantor");
            }
            const data = await this.guarantorRepository.create({
                fullName: guarantorData.fullName,
                phoneNo: phone,
                email: email,
                identificationImageUrl: guarantorData.identificationImageUrl,
                utilityBillImageUrl: guarantorData.utilityBillImageUrl,
                policeClearanceImageUrl: guarantorData.policeClearanceImageUrl,
                reference: guarantorData.reference,
                countryId: country.id,
                driverId,
            });
            if (count == 1) {
                if (data.id) {
                    await this.driverService.update(driverId, {
                        isGuarantorCompleted: true,
                    });
                }
            }
            return data;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async update(id, guarantorData) {
        return await this.guarantorRepository.update(id, guarantorData);
    }
    async deleteGuarantor(id, driverId) {
        const guarantor = await this.guarantorRepository.findById(id);
        if (!guarantor) {
            throw new common_1.BadRequestException('Guarantor not found');
        }
        if (guarantor.driverId !== driverId) {
            throw new common_1.BadRequestException('Guarantor not found');
        }
        if (guarantor.status == guarantor_status_enum_1.GUARANTOR_STATUS.APPROVED) {
            throw new common_1.BadRequestException('Cannot delete approved guarantor');
        }
        const data = await this.guarantorRepository.deleteGuarantor(id, driverId);
        return data;
    }
    async deleteByDriverId(driverId) {
        return await this.guarantorRepository.deleteByDriverId(driverId);
    }
    canAddMoreGuarantors(driverId) {
        return this.guarantorRepository.countByDriverId(driverId)
            .then(count => count < this.MAX_GUARANTORS);
    }
};
exports.GuarantorService = GuarantorService;
exports.GuarantorService = GuarantorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [guarantor_repository_1.GuarantorRepository,
        country_service_1.CountryService,
        driver_service_1.DriverService])
], GuarantorService);
//# sourceMappingURL=guarantor.service.js.map