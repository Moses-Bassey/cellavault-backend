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
const country_controller_1 = require("./controllers/country.controller");
const country_service_1 = require("./services/country.service");
const country_repository_1 = require("./repositories/country.repository");
let CountriesModule = class CountriesModule {
};
exports.CountriesModule = CountriesModule;
exports.CountriesModule = CountriesModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([country_entity_1.Country])],
        controllers: [country_controller_1.CountryController],
        providers: [country_service_1.CountryService, country_repository_1.CountryRepository],
        exports: [country_service_1.CountryService, country_repository_1.CountryRepository],
    })
], CountriesModule);
//# sourceMappingURL=countries.module.js.map