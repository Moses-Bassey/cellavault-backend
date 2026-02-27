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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const driver_repository_1 = require("../repositories/driver.repository");
const cursor_util_1 = require("../../../utils/cursor.util");
const kyc_enums_1 = require("../../../enums/kyc.enums");
let DriverService = class DriverService {
    driverRepository;
    constructor(driverRepository) {
        this.driverRepository = driverRepository;
    }
    toAccountDto(d, v) {
        return {
            id: d.id,
            fullName: d.fullName,
            email: d.email ?? null,
            phoneNo: d.phoneNo ?? null,
            imageUrl: d.profileImageUrl ?? null,
            vehicleName: v ? `${v.brand} ${v.color}` : null,
            vehiclePlate: v ? v.plateNumber : null,
            status: d.isEmailVerified &&
                d.isPhoneVerified &&
                !d.isDisabled &&
                !d.isSoftDeleted
                ? 'ACTIVE'
                : 'INACTIVE',
            kycStatus: d.kycCompleted,
            joinDate: d.createdAt.toISOString(),
            shortDescription: null,
        };
    }
    async getSummary() {
        return this.driverRepository.getSummary();
    }
    async countActiveDrivers() {
        const kycStatus = kyc_enums_1.KYC_COMPLETED.ALL_COMPLETED;
        const drivers = await this.driverRepository.findActiveDrivers(kycStatus);
        return drivers?.length ?? null;
    }
    async listDrivers(params) {
        const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 50);
        const cursor = (0, cursor_util_1.decodeCursor)(params.cursor);
        const { drivers, nextCursor } = await this.driverRepository.listDrivers({
            search: params.search,
            status: params.status,
            kycStatus: params.kycStatus,
            limit,
            cursor,
        });
        const driverIds = drivers.map((d) => d.id);
        const [tripAgg, vehiclesMap] = await Promise.all([
            this.driverRepository.getTripAggregatesForDrivers(driverIds),
            this.driverRepository.getLatestVehiclesForDrivers(driverIds),
        ]);
        const items = drivers.map((d) => {
            const agg = tripAgg.get(d.id);
            const vehicle = vehiclesMap.get(d.id);
            return {
                id: d.id,
                fullName: d.fullName,
                email: d.email ?? null,
                phoneNo: d.phoneNo ?? null,
                imageUrl: d.profileImageUrl ?? null,
                vehicleName: vehicle ? `${vehicle.brand} ${vehicle.color}` : null,
                vehiclePlate: vehicle ? vehicle.plateNumber : null,
                status: d.verificationStatus,
                kycStatus: d.kycCompleted,
                totalTrips: agg?.totalTrips ?? 0,
                earningsMinor: agg?.earningsMinor ?? 0,
                lastActiveAt: agg?.lastActiveAt ? agg.lastActiveAt.toISOString() : null,
            };
        });
        return { items, nextCursor };
    }
    async getDriverAccount(driverId) {
        const [driver, vehicles] = await Promise.all([
            this.driverRepository.findById(driverId),
            this.driverRepository.getLatestVehiclesForDriver(driverId),
        ]);
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const vehicle = vehicles.get(driver.id);
        console.log('Vehicle', vehicle);
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        return this.toAccountDto(driver, vehicle);
    }
    async updateDriverAccount(driverId, patch) {
        if (patch.email && !patch.email.includes('@')) {
            throw new common_1.BadRequestException('Invalid email');
        }
        const updated = await this.driverRepository.updateById(driverId, patch);
        if (!updated)
            throw new common_1.NotFoundException('Driver not found');
        return {
            id: updated.id,
            fullName: updated.fullName,
            email: updated.email ?? null,
            phoneNo: updated.phoneNo ?? null,
            imageUrl: updated.imageUrl ?? null,
            vehicleName: updated.vehicleName ?? null,
            vehiclePlate: updated.vehiclePlate ?? null,
            status: updated.status,
            kycStatus: updated.kycStatus,
            joinDate: updated.createdAt.toISOString(),
            shortDescription: updated.shortDescription ?? null,
        };
    }
    async suspendDriver(driverId, body) {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        if (driver.status === 'SUSPENDED')
            return { ok: true };
        const updated = await this.driverRepository.updateById(driverId, {
            status: 'SUSPENDED',
            suspensionReason: body.reason?.slice(0, 500) ?? null,
            suspendedAt: new Date(),
        });
        if (!updated)
            throw new common_1.NotFoundException('Driver not found');
        return { ok: true };
    }
    async unsuspendDriver(driverId) {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        if (driver.status === 'ACTIVE')
            return { ok: true };
        const updated = await this.driverRepository.updateById(driverId, {
            status: 'ACTIVE',
            suspensionReason: null,
            suspendedAt: null,
        });
        if (!updated)
            throw new common_1.NotFoundException('Driver not found');
        return { ok: true };
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [driver_repository_1.DriverRepository])
], DriverService);
//# sourceMappingURL=driver.service.js.map