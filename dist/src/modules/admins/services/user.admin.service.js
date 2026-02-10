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
var UserAdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const user_service_1 = require("../../users/services/user.service");
const driver_service_1 = require("../../drivers/services/driver.service");
const password_util_1 = require("../../../utils/password.util");
let UserAdminService = UserAdminService_1 = class UserAdminService {
    userService;
    adminService;
    driverService;
    logger = new common_1.Logger(UserAdminService_1.name);
    constructor(userService, adminService, driverService) {
        this.userService = userService;
        this.adminService = adminService;
        this.driverService = driverService;
    }
    async getUsersData() {
        const [totalRiders, activeRiders, bannedRiders, newRidersThisMonth,] = await Promise.all([
            this.userService.countAllUsers(),
            this.userService.countActiveUsers(),
            this.userService.countBannedUsers(),
            this.userService.getNewUsersForMonth(),
        ]);
        return {
            totalRiders,
            activeRiders,
            bannedRiders,
            newRidersThisMonth,
        };
    }
    async findAll(options) {
        const offset = (options.page - 1) * options.limit;
        const users = await this.userService.findAll({ ...options, offset });
        const filterOptions = {
            search: options.search,
            status: options.status,
        };
        const totalCount = await this.userService.countFiltered(filterOptions);
        return {
            users,
            pagination: {
                totalCount,
                page: options.page,
                limit: options.limit,
            },
        };
    }
    async findById(id) {
        const user = await this.userService.fetchUser(id);
        return user;
    }
    async disableUser(id, adminId, password) {
        const admin = await this.adminService.findById(adminId);
        const isMatch = await this.verifyAdminPassword(password, admin.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Unauthorized');
        const updated = await this.userService.update(id, {
            isDisabled: true,
            isActive: false,
        });
        if (!updated)
            throw new common_1.NotFoundException('User not found for update');
        return;
    }
    async verifyAdminPassword(password, adminPassword) {
        const isPasswordValid = await password_util_1.PasswordUtil.verifyPassword(password, adminPassword);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return true;
    }
};
exports.UserAdminService = UserAdminService;
exports.UserAdminService = UserAdminService = UserAdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        admin_service_1.AdminService,
        driver_service_1.DriverService])
], UserAdminService);
//# sourceMappingURL=user.admin.service.js.map