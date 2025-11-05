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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const driver_repository_1 = require("../repositories/driver.repository");
let DriverService = class DriverService {
    driverRepository;
    constructor(driverRepository) {
        this.driverRepository = driverRepository;
    }
    async findById(id) {
        return await this.driverRepository.findById(id);
    }
    async findByIdentity(identity) {
        return await this.driverRepository.findByIdentity(identity);
    }
    async findByEmail(email) {
        return await this.driverRepository.findByEmail(email);
    }
    async findAll(options) {
        return await this.driverRepository.findAll(options);
    }
    async update(id, driverData) {
        return await this.driverRepository.update(id, driverData);
    }
    async delete(id) {
        return await this.driverRepository.delete(id);
    }
    async restore(id) {
        return await this.driverRepository.restore(id);
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [driver_repository_1.DriverRepository])
], DriverService);
//# sourceMappingURL=driver.service.js.map