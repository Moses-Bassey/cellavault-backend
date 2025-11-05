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
let GuarantorService = class GuarantorService {
    guarantorRepository;
    MAX_GUARANTORS = 3;
    constructor(guarantorRepository) {
        this.guarantorRepository = guarantorRepository;
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
        const count = await this.guarantorRepository.countByDriverId(driverId);
        if (count >= this.MAX_GUARANTORS) {
            throw new common_1.BadRequestException(`Maximum of ${this.MAX_GUARANTORS} guarantors allowed per driver`);
        }
        return await this.guarantorRepository.create({
            ...guarantorData,
            driverId,
        });
    }
    async update(id, guarantorData) {
        return await this.guarantorRepository.update(id, guarantorData);
    }
    async delete(id) {
        return await this.guarantorRepository.delete(id);
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
    __metadata("design:paramtypes", [guarantor_repository_1.GuarantorRepository])
], GuarantorService);
//# sourceMappingURL=guarantor.service.js.map