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
exports.LgaRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const lga_entity_1 = require("../entities/lga.entity");
let LgaRepository = class LgaRepository {
    lgaModel;
    constructor(lgaModel) {
        this.lgaModel = lgaModel;
    }
    async findById(id) {
        return await this.lgaModel.findByPk(id);
    }
    async findByStateId(stateId) {
        return await this.lgaModel.findAll({
            where: { stateId },
            order: [['name', 'ASC']],
        });
    }
    async findAll(options) {
        return await this.lgaModel.findAll(options);
    }
    async create(lgaData) {
        return await this.lgaModel.create(lgaData);
    }
    async update(id, lgaData) {
        return await this.lgaModel.update(lgaData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.lgaModel.destroy({
            where: { id },
        });
    }
    async restore(id) {
        return await this.lgaModel.restore({
            where: { id },
        });
    }
};
exports.LgaRepository = LgaRepository;
exports.LgaRepository = LgaRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(lga_entity_1.LGA)),
    __metadata("design:paramtypes", [Object])
], LgaRepository);
//# sourceMappingURL=lga.repository.js.map