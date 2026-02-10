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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("../repositories/admin.repository");
const user_service_1 = require("../../users/services/user.service");
const driver_service_1 = require("../../drivers/services/driver.service");
let AdminService = AdminService_1 = class AdminService {
    adminRepository;
    userService;
    driverService;
    logger = new common_1.Logger(AdminService_1.name);
    constructor(adminRepository, userService, driverService) {
        this.adminRepository = adminRepository;
        this.userService = userService;
        this.driverService = driverService;
    }
    async findById(id) {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            this.logger.warn(`Admin with id=${id} not found`);
            throw new common_1.NotFoundException('Admin not found');
        }
        return admin;
    }
    async findAll(options) {
        const ratings = await this.adminRepository.findAll(options);
        this.logger.log(`Found ${ratings.length} ratings (filters: ${JSON.stringify(options)})`);
        return ratings;
    }
    async update(id, data) {
        const [affectedCount] = await this.adminRepository.update(id, data);
        console.log('Affected count: ', affectedCount);
        if (affectedCount == 0) {
            this.logger.warn(`Admin data not updated`);
            throw new common_1.BadRequestException('Failed to update');
        }
        this.logger.log(`Admin data updated`);
        return affectedCount;
    }
    async restore(id) {
        return await this.adminRepository.restore(id);
    }
    async getDashboardData() {
        const [activeDrivers, activeUsers,] = await Promise.all([
            this.driverService.countActiveDrivers(),
            this.userService.countActiveUsers(),
        ]);
        return {
            activeDrivers,
            activeUsers,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository,
        user_service_1.UserService,
        driver_service_1.DriverService])
], AdminService);
//# sourceMappingURL=admin.service.js.map