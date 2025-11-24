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
exports.CngConversionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cng_conversion_entity_1 = require("../entities/cng-conversion.entity");
let CngConversionRepository = class CngConversionRepository {
    cngConversionModel;
    constructor(cngConversionModel) {
        this.cngConversionModel = cngConversionModel;
    }
    async count(options) {
        const count = await this.cngConversionModel.count(options);
        return typeof count === 'number' ? count : count.length || 0;
    }
    async findById(id) {
        return await this.cngConversionModel.findByPk(id, { raw: true });
    }
    async findAll(options) {
        return await this.cngConversionModel.findAll(options);
    }
    async create(cngConversionData) {
        const cngConversion = await this.cngConversionModel.create(cngConversionData, { raw: true, returning: true });
        return cngConversion.toJSON();
    }
    async update(id, cngConversionData) {
        return await this.cngConversionModel.update(cngConversionData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.cngConversionModel.destroy({
            where: { id },
        });
    }
};
exports.CngConversionRepository = CngConversionRepository;
exports.CngConversionRepository = CngConversionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(cng_conversion_entity_1.CngConversion)),
    __metadata("design:paramtypes", [Object])
], CngConversionRepository);
//# sourceMappingURL=cng-conversion.repository.js.map