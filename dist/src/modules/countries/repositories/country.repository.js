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
exports.CountryRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const country_entity_1 = require("../entities/country.entity");
let CountryRepository = class CountryRepository {
    countryModel;
    constructor(countryModel) {
        this.countryModel = countryModel;
    }
    async findById(id) {
        return await this.countryModel.findByPk(id);
    }
    async findByName(name) {
        return await this.countryModel.findOne({
            where: { name },
        });
    }
    async findAll(options) {
        return await this.countryModel.findAll(options);
    }
    async create(countryData) {
        return await this.countryModel.create(countryData);
    }
    async update(id, countryData) {
        return await this.countryModel.update(countryData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.countryModel.destroy({
            where: { id },
        });
    }
    async restore(id) {
        await this.countryModel.restore({
            where: { id },
        });
    }
};
exports.CountryRepository = CountryRepository;
exports.CountryRepository = CountryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(country_entity_1.Country)),
    __metadata("design:paramtypes", [Object])
], CountryRepository);
//# sourceMappingURL=country.repository.js.map