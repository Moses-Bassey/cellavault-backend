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
exports.StateRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const state_entity_1 = require("../entities/state.entity");
let StateRepository = class StateRepository {
    stateModel;
    constructor(stateModel) {
        this.stateModel = stateModel;
    }
    async findById(id) {
        return await this.stateModel.findByPk(id);
    }
    async findByCountryId(countryId) {
        return await this.stateModel.findAll({
            where: { countryId },
            order: [['name', 'ASC']],
        });
    }
    async findAll(options) {
        return await this.stateModel.findAll(options);
    }
    async create(stateData) {
        return await this.stateModel.create(stateData);
    }
    async update(id, stateData) {
        return await this.stateModel.update(stateData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.stateModel.destroy({
            where: { id },
        });
    }
    async restore(id) {
        await this.stateModel.restore({
            where: { id },
        });
    }
};
exports.StateRepository = StateRepository;
exports.StateRepository = StateRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(state_entity_1.State)),
    __metadata("design:paramtypes", [Object])
], StateRepository);
//# sourceMappingURL=state.repository.js.map