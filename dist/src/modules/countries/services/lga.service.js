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
exports.LgaService = void 0;
const common_1 = require("@nestjs/common");
const lga_repository_1 = require("../repositories/lga.repository");
let LgaService = class LgaService {
    lgaRepository;
    constructor(lgaRepository) {
        this.lgaRepository = lgaRepository;
    }
    async findById(id) {
        return await this.lgaRepository.findById(id);
    }
    async findByStateId(stateId) {
        const lgas = await this.lgaRepository.findByStateId(stateId);
        return lgas;
    }
    async findAll(options) {
        const lgas = await this.lgaRepository.findAll(options);
        return lgas;
    }
    async create(lgaData) {
        return await this.lgaRepository.create(lgaData);
    }
    async update(id, lgaData) {
        return await this.lgaRepository.update(id, lgaData);
    }
    async delete(id) {
        return await this.lgaRepository.delete(id);
    }
    async restore(id) {
        return await this.lgaRepository.restore(id);
    }
};
exports.LgaService = LgaService;
exports.LgaService = LgaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lga_repository_1.LgaRepository])
], LgaService);
//# sourceMappingURL=lga.service.js.map