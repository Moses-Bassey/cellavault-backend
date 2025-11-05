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
exports.StateService = void 0;
const common_1 = require("@nestjs/common");
const state_repository_1 = require("../repositories/state.repository");
const response_utils_1 = require("../../../utils/response.utils");
let StateService = class StateService {
    stateRepository;
    constructor(stateRepository) {
        this.stateRepository = stateRepository;
    }
    async findById(id) {
        return await this.stateRepository.findById(id);
    }
    async findByCountryId(countryId) {
        try {
            const states = await this.stateRepository.findByCountryId(countryId);
            return response_utils_1.ResponseUtil.success(states, 'States retrieved successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return response_utils_1.ResponseUtil.errorFromException(error, 'An error occurred during find states by country', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(options) {
        try {
            const states = await this.stateRepository.findAll(options);
            return response_utils_1.ResponseUtil.success(states, 'States retrieved successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return response_utils_1.ResponseUtil.errorFromException(error, 'An error occurred during find all states', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(stateData) {
        return await this.stateRepository.create(stateData);
    }
    async update(id, stateData) {
        return await this.stateRepository.update(id, stateData);
    }
    async delete(id) {
        return await this.stateRepository.delete(id);
    }
    async restore(id) {
        await this.stateRepository.restore(id);
    }
};
exports.StateService = StateService;
exports.StateService = StateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [state_repository_1.StateRepository])
], StateService);
//# sourceMappingURL=state.service.js.map