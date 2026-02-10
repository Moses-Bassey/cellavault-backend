"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const auth_module_1 = require("../auth/auth.module");
const admin_entity_1 = require("./entities/admin.entity");
const auth_admin_controller_1 = require("./controllers/auth.admin.controller");
const admin_controller_1 = require("./controllers/admin.controller");
const users_admin_controller_1 = require("./controllers/users.admin.controller");
const auth_admin_service_1 = require("./services/auth.admin.service");
const admin_service_1 = require("./services/admin.service");
const user_admin_service_1 = require("./services/user.admin.service");
const admin_repository_1 = require("./repositories/admin.repository");
const client_devices_module_1 = require("../client-devices/client-devices.module");
const drivers_module_1 = require("../drivers/drivers.module");
const users_module_1 = require("../users/users.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([admin_entity_1.Admin]),
            client_devices_module_1.ClientDevicesModule,
            auth_module_1.AuthModule,
            drivers_module_1.DriversModule,
            users_module_1.UsersModule,
        ],
        controllers: [auth_admin_controller_1.AuthAdminController, admin_controller_1.AdminController, users_admin_controller_1.UserAdminController],
        providers: [
            admin_service_1.AdminService,
            admin_repository_1.AdminRepository,
            auth_admin_service_1.AuthAdminService,
            user_admin_service_1.UserAdminService,
        ],
        exports: [admin_service_1.AdminService, admin_repository_1.AdminRepository],
    })
], AdminModule);
//# sourceMappingURL=admins.module.js.map