"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const mail_module_1 = require("../../services/mail/mail.module");
const token_module_1 = require("../../services/token/token.module");
const user_entity_1 = require("../users/entities/user.entity");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_service_1 = require("./auth.service");
const user_repository_1 = require("../users/repositories/user.repository");
const countries_module_1 = require("../countries/countries.module");
const users_module_1 = require("../users/users.module");
const client_devices_module_1 = require("../client-devices/client-devices.module");
const passcode_entity_1 = require("./entities/passcode.entity");
const passcode_repository_1 = require("./repositories/passcode.repository");
const passcode_service_1 = require("./services/passcode.service");
const passcode_controller_1 = require("./controllers/passcode.controller");
const driver_entity_1 = require("../drivers/entities/driver.entity");
const driver_repository_1 = require("../drivers/repositories/driver.repository");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([user_entity_1.User, passcode_entity_1.Passcode, driver_entity_1.Driver]),
            token_module_1.TokenModule,
            mail_module_1.MailModule,
            countries_module_1.CountriesModule,
            users_module_1.UsersModule,
            client_devices_module_1.ClientDevicesModule,
        ],
        providers: [
            auth_service_1.AuthService,
            user_repository_1.UserRepository,
            passcode_service_1.PasscodeService,
            passcode_repository_1.PasscodeRepository,
            driver_repository_1.DriverRepository,
        ],
        controllers: [auth_controller_1.AuthController, passcode_controller_1.PasscodeController],
        exports: [passcode_service_1.PasscodeService, passcode_repository_1.PasscodeRepository],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map