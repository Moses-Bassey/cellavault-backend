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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const driver_entity_1 = require("../entities/driver.entity");
const vehicle_entity_1 = require("../entities/vehicle.entity");
const trip_entity_1 = require("../../trips/entities/trip.entity");
let DriverRepository = class DriverRepository {
    driverModel;
    vehicleModel;
    tripModel;
    constructor(driverModel, vehicleModel, tripModel) {
        this.driverModel = driverModel;
        this.vehicleModel = vehicleModel;
        this.tripModel = tripModel;
    }
    async getSummary() {
        const row = await this.driverModel.findOne({
            attributes: [
                [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'totalDrivers'],
                [
                    (0, sequelize_2.fn)('SUM', (0, sequelize_2.literal)(`CASE WHEN verificationStatus = 'VERIFIED' THEN 1 ELSE 0 END`)),
                    'activeDrivers',
                ],
                [
                    (0, sequelize_2.fn)('SUM', (0, sequelize_2.literal)(`CASE WHEN isDisabled = true THEN 1 ELSE 0 END`)),
                    'suspendedDrivers',
                ],
                [
                    (0, sequelize_2.fn)('SUM', (0, sequelize_2.literal)(`CASE WHEN kycCompleted != 'ALL_COMPLETED' THEN 1 ELSE 0 END`)),
                    'pendingKycApprovals',
                ],
                [(0, sequelize_2.literal)('0'), 'driversWithPendingPayouts'],
            ],
            raw: true,
        });
        return {
            totalDrivers: Number(row?.['totalDrivers'] ?? 0),
            activeDrivers: Number(row?.['activeDrivers'] ?? 0),
            suspendedDrivers: Number(row?.['suspendedDrivers'] ?? 0),
            pendingKycApprovals: Number(row?.['pendingKycApprovals'] ?? 0),
            driversWithPendingPayouts: Number(row?.['driversWithPendingPayouts'] ?? 0),
        };
    }
    async findActiveDrivers(kycCompleted) {
        return await this.driverModel.findAll({
            where: { kycCompleted },
        });
    }
    async findById(driverId) {
        return this.driverModel.findByPk(driverId);
    }
    async updateById(driverId, patch) {
        const [affected] = await this.driverModel.update(patch, {
            where: { id: driverId },
        });
        if (!affected)
            return null;
        return this.findById(driverId);
    }
    async listDrivers(params) {
        const { search, status, kycStatus, limit, cursor } = params;
        const q = search?.trim() ? `%${search.trim()}%` : undefined;
        const where = {
            ...(status ? { verificationStatus: status } : {}),
            ...(kycStatus ? { kycCompleted: kycStatus } : {}),
            ...(q
                ? {
                    [sequelize_2.Op.or]: [
                        { fullName: { [sequelize_2.Op.like]: q } },
                        { email: { [sequelize_2.Op.like]: q } },
                        { phoneNo: { [sequelize_2.Op.like]: q } },
                    ],
                }
                : {}),
            ...(cursor
                ? {
                    [sequelize_2.Op.and]: [
                        {
                            [sequelize_2.Op.or]: [
                                { createdAt: { [sequelize_2.Op.lt]: cursor.createdAt } },
                                { createdAt: cursor.createdAt, id: { [sequelize_2.Op.lt]: cursor.id } },
                            ],
                        },
                    ],
                }
                : {}),
        };
        const rows = await this.driverModel.findAll({
            where,
            order: [
                ['createdAt', 'DESC'],
                ['id', 'DESC'],
            ],
            limit,
            attributes: [
                'id',
                'fullName',
                'email',
                'phoneNo',
                'profileImageUrl',
                'verificationStatus',
                'kycCompleted',
                'createdAt',
            ],
            raw: true,
        });
        const last = rows[rows.length - 1];
        const nextCursor = rows.length === limit && last
            ? Buffer.from(JSON.stringify({ createdAt: last.createdAt, id: last.id })).toString('base64')
            : null;
        return { drivers: rows, nextCursor };
    }
    async getLatestVehiclesForDrivers(driverIds) {
        const map = new Map();
        driverIds.forEach((id) => map.set(id, null));
        if (driverIds.length === 0)
            return map;
        const vehicles = await this.vehicleModel.findAll({
            where: { driverId: { [sequelize_2.Op.in]: driverIds } },
            attributes: [
                'driverId',
                'plateNumber',
                'brand',
                'color',
                'createdAt',
                'id',
            ],
            order: [
                ['driverId', 'ASC'],
                ['createdAt', 'DESC'],
                ['id', 'DESC'],
            ],
            raw: true,
        });
        for (const v of vehicles) {
            if (!map.get(v.driverId)) {
                map.set(v.driverId, {
                    plateNumber: v.plateNumber,
                    brand: v.brand,
                    color: v.color,
                });
            }
        }
        return map;
    }
    async getLatestVehiclesForDriver(driverId) {
        const map = new Map();
        map.set(driverId, null);
        if (!driverId)
            return map;
        const vehicles = await this.vehicleModel.findAll({
            where: { driverId },
            attributes: [
                'driverId',
                'plateNumber',
                'brand',
                'color',
                'createdAt',
                'id',
            ],
            order: [
                ['driverId', 'ASC'],
                ['createdAt', 'DESC'],
                ['id', 'DESC'],
            ],
            raw: true,
        });
        for (const v of vehicles) {
            if (!map.get(v.driverId)) {
                map.set(v.driverId, {
                    plateNumber: v.plateNumber,
                    brand: v.brand,
                    color: v.color,
                });
            }
        }
        console.log('map: ', map);
        return map;
    }
    async getTripAggregatesForDrivers(driverIds) {
        if (driverIds.length === 0)
            return new Map();
        const rows = await this.tripModel.findAll({
            where: { driverId: { [sequelize_2.Op.in]: driverIds } },
            attributes: [
                'driverId',
                [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'totalTrips'],
                [(0, sequelize_2.fn)('MAX', (0, sequelize_2.col)('updatedAt')), 'lastActiveAt'],
                [
                    (0, sequelize_2.fn)('COALESCE', (0, sequelize_2.fn)('SUM', (0, sequelize_2.literal)(`CASE WHEN status = 'COMPLETED' THEN estimatedFee ELSE 0 END`)), 0),
                    'earningsNaira',
                ],
            ],
            group: ['driverId'],
            raw: true,
        });
        const map = new Map();
        for (const r of rows) {
            const earningsNaira = Number(r.earningsNaira ?? 0);
            map.set(r.driverId, {
                totalTrips: Number(r.totalTrips ?? 0),
                earningsMinor: Math.round(earningsNaira * 100),
                lastActiveAt: r.lastActiveAt ? new Date(r.lastActiveAt) : null,
            });
        }
        return map;
    }
};
exports.DriverRepository = DriverRepository;
exports.DriverRepository = DriverRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(driver_entity_1.Driver)),
    __param(1, (0, sequelize_1.InjectModel)(vehicle_entity_1.Vehicle)),
    __param(2, (0, sequelize_1.InjectModel)(trip_entity_1.Trip)),
    __metadata("design:paramtypes", [Object, Object, Object])
], DriverRepository);
//# sourceMappingURL=driver.repository.js.map