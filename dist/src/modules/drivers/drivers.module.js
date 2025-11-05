"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const driver_entity_1 = require("./entities/driver.entity");
const guarantor_entity_1 = require("./entities/guarantor.entity");
const kyc1_personal_Info_entity_1 = require("./entities/kyc1-personal-Info.entity");
const kyc2_Id_Information_entity_1 = require("./entities/kyc2-Id-Information.entity");
const kyc3_residential_Information_entity_1 = require("./entities/kyc3-residential-Information.entity");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const pepp_driver_vehicles_entity_1 = require("./entities/pepp-driver-vehicles.entity");
const driver_controller_1 = require("./controllers/driver.controller");
const guarantor_controller_1 = require("./controllers/guarantor.controller");
const driver_service_1 = require("./services/driver.service");
const guarantor_service_1 = require("./services/guarantor.service");
const driver_repository_1 = require("./repositories/driver.repository");
const guarantor_repository_1 = require("./repositories/guarantor.repository");
const auth_driver_controller_1 = require("./controllers/auth.driver.controller");
const auth_driver_service_1 = require("./services/auth.driver.service");
const countries_module_1 = require("../countries/countries.module");
const client_devices_module_1 = require("../client-devices/client-devices.module");
const mail_module_1 = require("../../services/mail/mail.module");
const token_module_1 = require("../../services/token/token.module");
const sms_module_1 = require("../../services/sms/sms.module");
let DriversModule = class DriversModule {
};
exports.DriversModule = DriversModule;
exports.DriversModule = DriversModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                driver_entity_1.Driver,
                guarantor_entity_1.Guarantor,
                kyc1_personal_Info_entity_1.kyc1PersonalInfo,
                kyc2_Id_Information_entity_1.kyc2IdInformation,
                kyc3_residential_Information_entity_1.kyc3ResidentialInformation,
                vehicle_entity_1.Vehicle,
                pepp_driver_vehicles_entity_1.PeppDriverVehicles,
            ]),
            countries_module_1.CountriesModule,
            client_devices_module_1.ClientDevicesModule,
            token_module_1.TokenModule,
            mail_module_1.MailModule,
            sms_module_1.SmsModule,
        ],
        controllers: [driver_controller_1.DriverController, guarantor_controller_1.GuarantorController, auth_driver_controller_1.AuthDriverController],
        providers: [driver_service_1.DriverService, auth_driver_service_1.AuthDriverService, guarantor_service_1.GuarantorService, driver_repository_1.DriverRepository, guarantor_repository_1.GuarantorRepository],
        exports: [driver_service_1.DriverService, guarantor_service_1.GuarantorService, driver_repository_1.DriverRepository, guarantor_repository_1.GuarantorRepository],
    })
], DriversModule);
//# sourceMappingURL=drivers.module.js.map