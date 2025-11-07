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
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const country_repository_1 = require("../repositories/country.repository");
let CountryService = class CountryService {
    countryRepository;
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }
    async findById(id) {
        return await this.countryRepository.findById(id);
    }
    async findByName(name) {
        return await this.countryRepository.findByName(name);
    }
    async findAll(options) {
        const countries = await this.countryRepository.findAll(options);
        return countries;
    }
    async create(countryData) {
        return await this.countryRepository.create(countryData);
    }
    async update(id, countryData) {
        return await this.countryRepository.update(id, countryData);
    }
    async delete(id) {
        return await this.countryRepository.delete(id);
    }
    async restore(id) {
        await this.countryRepository.restore(id);
    }
};
exports.CountryService = CountryService;
exports.CountryService = CountryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [country_repository_1.CountryRepository])
], CountryService);
//# sourceMappingURL=country.service.js.map