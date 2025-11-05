"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const country_entity_1 = require("./entities/country.entity");
const state_entity_1 = require("./entities/state.entity");
const country_controller_1 = require("./controllers/country.controller");
const country_service_1 = require("./services/country.service");
const state_service_1 = require("./services/state.service");
const country_repository_1 = require("./repositories/country.repository");
const state_repository_1 = require("./repositories/state.repository");
let CountriesModule = class CountriesModule {
};
exports.CountriesModule = CountriesModule;
exports.CountriesModule = CountriesModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([country_entity_1.Country, state_entity_1.State])],
        controllers: [country_controller_1.CountryController],
        providers: [country_service_1.CountryService, state_service_1.StateService, country_repository_1.CountryRepository, state_repository_1.StateRepository],
        exports: [country_service_1.CountryService, state_service_1.StateService, country_repository_1.CountryRepository, state_repository_1.StateRepository],
    })
], CountriesModule);
//# sourceMappingURL=countries.module.js.map