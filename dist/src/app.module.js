"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const sequelize_1 = require("@nestjs/sequelize");
const app_config_1 = __importDefault(require("./config/app.config"));
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const drivers_module_1 = require("./modules/drivers/drivers.module");
const countries_module_1 = require("./modules/countries/countries.module");
const cng_conversion_module_1 = require("./modules/cng-conversion/cng-conversion.module");
const client_devices_module_1 = require("./modules/client-devices/client-devices.module");
const token_module_1 = require("./services/token/token.module");
const mail_module_1 = require("./services/mail/mail.module");
const sms_module_1 = require("./services/sms/sms.module");
const axios_module_1 = require("./services/axios/axios.module");
const api_key_interceptors_1 = require("./interceptors/api-key.interceptors");
const entities_1 = require("./modules/users/entities");
const entities_2 = require("./modules/drivers/entities");
const guarantor_entity_1 = require("./modules/drivers/entities/guarantor.entity");
const kyc1_personal_Info_entity_1 = require("./modules/drivers/entities/kyc1-personal-Info.entity");
const kyc2_Id_Information_entity_1 = require("./modules/drivers/entities/kyc2-Id-Information.entity");
const kyc3_residential_Information_entity_1 = require("./modules/drivers/entities/kyc3-residential-Information.entity");
const vehicle_entity_1 = require("./modules/drivers/entities/vehicle.entity");
const pepp_driver_vehicles_entity_1 = require("./modules/drivers/entities/pepp-driver-vehicles.entity");
const entities_3 = require("./modules/countries/entities");
const cng_conversion_entity_1 = require("./modules/cng-conversion/entities/cng-conversion.entity");
const cng_station_entity_1 = require("./modules/cng-conversion/entities/cng-station.entity");
const client_device_entity_1 = require("./modules/client-devices/entities/client-device.entity");
const entities_4 = require("./services/token/entities");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default],
            }),
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'mysql',
                host: process.env.DATABASE_HOST,
                port: Number(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                autoLoadModels: true,
                models: [
                    entities_1.User,
                    entities_2.Driver,
                    guarantor_entity_1.Guarantor,
                    kyc1_personal_Info_entity_1.kyc1PersonalInfo,
                    kyc2_Id_Information_entity_1.kyc2IdInformation,
                    kyc3_residential_Information_entity_1.kyc3ResidentialInformation,
                    vehicle_entity_1.Vehicle,
                    pepp_driver_vehicles_entity_1.PeppDriverVehicles,
                    entities_3.Country,
                    entities_3.State,
                    entities_3.LGA,
                    cng_conversion_entity_1.CngConversion,
                    cng_station_entity_1.CngStation,
                    client_device_entity_1.ClientDevice,
                    entities_4.Token,
                ],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('app.rateLimitTtl') || 60000,
                        limit: config.get('app.rateLimitLimit') || 10,
                    },
                ],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            drivers_module_1.DriversModule,
            countries_module_1.CountriesModule,
            cng_conversion_module_1.CngConversionModule,
            client_devices_module_1.ClientDevicesModule,
            token_module_1.TokenModule,
            mail_module_1.MailModule,
            sms_module_1.SmsModule,
            axios_module_1.AxiosModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, api_key_interceptors_1.ApiKeyInterceptor],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map