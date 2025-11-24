"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CngConversionModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cng_conversion_entity_1 = require("./entities/cng-conversion.entity");
const cng_station_entity_1 = require("./entities/cng-station.entity");
const user_entity_1 = require("../users/entities/user.entity");
const users_module_1 = require("../users/users.module");
const cng_conversion_controller_1 = require("./controllers/cng-conversion.controller");
const cng_conversion_service_1 = require("./services/cng-conversion.service");
const cng_station_service_1 = require("./services/cng-station.service");
const cng_conversion_repository_1 = require("./repositories/cng-conversion.repository");
const cng_station_repository_1 = require("./repositories/cng-station.repository");
let CngConversionModule = class CngConversionModule {
};
exports.CngConversionModule = CngConversionModule;
exports.CngConversionModule = CngConversionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([cng_conversion_entity_1.CngConversion, cng_station_entity_1.CngStation, user_entity_1.User]),
            users_module_1.UsersModule,
        ],
        controllers: [cng_conversion_controller_1.CngConversionController],
        providers: [
            cng_conversion_service_1.CngConversionService,
            cng_station_service_1.CngStationService,
            cng_conversion_repository_1.CngConversionRepository,
            cng_station_repository_1.CngStationRepository,
        ],
        exports: [
            cng_conversion_service_1.CngConversionService,
            cng_station_service_1.CngStationService,
            cng_conversion_repository_1.CngConversionRepository,
            cng_station_repository_1.CngStationRepository,
        ],
    })
], CngConversionModule);
//# sourceMappingURL=cng-conversion.module.js.map