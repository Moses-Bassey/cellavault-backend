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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_repository_1 = require("../repositories/user.repository");
const client_device_service_1 = require("../../client-devices/services/client-device.service");
const trip_repository_1 = require("../../trips/repositories/trip.repository");
const payment_repository_1 = require("../../payment/repositories/payment.repository");
const coin_repository_1 = require("../../payment/repositories/coin.repository");
const cursor_util_1 = require("../../../utils/cursor.util");
function parseISODateOrUndefined(value) {
    if (!value)
        return undefined;
    const d = new Date(value);
    if (Number.isNaN(d.getTime()))
        throw new common_1.BadRequestException('Invalid date');
    return d;
}
let UserService = class UserService {
    userRepository;
    clientDeviceService;
    rides;
    payments;
    coins;
    configService;
    constructor(userRepository, clientDeviceService, rides, payments, coins, configService) {
        this.userRepository = userRepository;
        this.clientDeviceService = clientDeviceService;
        this.rides = rides;
        this.payments = payments;
        this.coins = coins;
        this.configService = configService;
    }
    toAccountDto(p) {
        return {
            id: p.id,
            fullName: p.fullName,
            email: p.email ?? null,
            phoneNumber: p.phoneNo ?? null,
            imageUrl: p.imageUrl ?? null,
            status: p.isEmailVerified && p.isPhoneVerified
                ? 'VERIFIED'
                : 'PENDING VERIFICATION',
            joinDate: p.createdAt.toISOString(),
            shortDescription: null,
        };
    }
    async fetchUser(id) {
        try {
            const user = await this.userRepository.fetchUser(id);
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            return user;
        }
        catch (error) {
            throw new common_1.NotFoundException('User not found!');
        }
    }
    async dashboard(data, userId) {
        try {
            const { deviceFCMToken, ipAddress, name } = data;
            const user = await this.userRepository.fetchUser(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(userId, deviceFCMToken);
            if (clientDevice == null) {
                await this.clientDeviceService.registerDevice({
                    userId: userId,
                    deviceFCMToken: deviceFCMToken,
                    ipAddress: ipAddress,
                    name: name,
                    userType: user.userType,
                });
            }
            else {
                await this.clientDeviceService.updateDeviceToken(clientDevice.id, deviceFCMToken);
            }
            const dashboardRes = {
                fullName: user.fullName,
                email: user.email,
                phoneNo: user.phoneNo,
                userId: user.id,
            };
            return dashboardRes;
        }
        catch (error) {
            throw new common_1.NotFoundException('User not found!');
        }
    }
    async findAll(options) {
        return await this.userRepository.findAll(options);
    }
    async countFiltered(options) {
        return this.userRepository.countFiltered(options);
    }
    async update(id, userData) {
        return await this.userRepository.update(id, userData);
    }
    async delete(id) {
        return await this.userRepository.delete(id);
    }
    async restore(id) {
        await this.userRepository.restore(id);
    }
    async countActiveUsers() {
        const isDisabled = false;
        const users = await this.userRepository.findActiveUsers(isDisabled);
        return users?.length ?? null;
    }
    async countAllUsers() {
        const users = await this.userRepository.countAll();
        return users?.length ?? null;
    }
    async countBannedUsers() {
        const isDisabled = true;
        const users = await this.userRepository.findAllBanned(isDisabled);
        return users?.length ?? null;
    }
    async getNewUsersForMonth() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const currentMonthUsers = await this.userRepository.getNewUsersForMonth(currentYear, currentMonth);
        return currentMonthUsers?.length ?? null;
    }
    async getPassengerAccount(passengerId) {
        const passenger = await this.userRepository.findById(passengerId);
        if (!passenger)
            throw new common_1.NotFoundException('Passenger not found');
        return this.toAccountDto(passenger);
    }
    async updatePassengerAccount(passengerId, patch) {
        const passenger = await this.userRepository.findById(passengerId);
        if (!passenger)
            throw new common_1.NotFoundException('Passenger not found');
        if (patch.email && !patch.email.includes('@')) {
            throw new common_1.BadRequestException('Invalid email');
        }
        const updated = await this.userRepository.update(passengerId, {
            fullName: patch.fullName,
            email: patch.email,
            phoneNo: patch.phoneNo,
            imageUrl: patch.imageUrl,
        });
        if (!updated)
            throw new common_1.NotFoundException('Passenger not found');
        const user = await this.fetchUser(passengerId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        console.log('Update: ', updated, '\n', 'User: ', user);
        return this.toAccountDto(user);
    }
    async suspendPassenger(passengerId, body) {
        const passenger = await this.userRepository.findById(passengerId);
        if (!passenger)
            throw new common_1.NotFoundException('Passenger not found');
        if (passenger.isActive === false && passenger.isDisabled === true)
            return { ok: true };
        await this.userRepository.update(passengerId, {
            isDisabled: true,
            isActive: false,
        });
        return { ok: true };
    }
    async unsuspendPassenger(passengerId) {
        const passenger = await this.userRepository.findById(passengerId);
        if (!passenger)
            throw new common_1.NotFoundException('Passenger not found');
        if (passenger.isActive === true && passenger.isDisabled === false)
            return { ok: true };
        await this.userRepository.update(passengerId, {
            isDisabled: false,
            isActive: true,
        });
        return { ok: true };
    }
    async getPassengerActivitySummary(params) {
        const passenger = await this.userRepository.findById(params.passengerId);
        if (!passenger)
            throw new common_1.NotFoundException('Passenger not found');
        const from = parseISODateOrUndefined(params.from);
        const to = parseISODateOrUndefined(params.to);
        const [rideSummary, totalSpend, totalCoins] = await Promise.all([
            this.rides.getPassengerRideSummary(params.passengerId, from, to),
            this.payments.sumPassengerSpend(params.passengerId, from, to),
            this.coins.sumPassengerCoins(params.passengerId, from, to),
        ]);
        return {
            ...rideSummary,
            totalSpend,
            totalCoins,
            from: from?.toISOString(),
            to: to?.toISOString(),
        };
    }
    async listPassengerRides(params) {
        const passenger = await this.userRepository.findById(params.passengerId);
        if (!passenger)
            throw new common_1.NotFoundException('Passenger not found');
        const from = parseISODateOrUndefined(params.from);
        const to = parseISODateOrUndefined(params.to);
        const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 50);
        const cursor = (0, cursor_util_1.decodeCursor)(params.cursor);
        const { rows, nextCursor } = await this.rides.listPassengerRides({
            userId: params.passengerId,
            from,
            to,
            status: params.status,
            limit,
            cursor,
        });
        return {
            items: rows.map((r) => ({
                id: r.id,
                pickupLabel: r.pickupLocation,
                pickupAddress: r.pickupAddress,
                dropoffLabel: r.dropoffLocation,
                dropoffAddress: r.dropoffAddress,
                status: r.status,
                createdAt: new Date(r.createdAt).toISOString(),
            })),
            nextCursor,
        };
    }
    async getRideDetails(passengerId, rideId) {
        const ride = await this.rides.findPassengerRideById(passengerId, rideId);
        if (!ride)
            throw new common_1.NotFoundException('Ride not found for passenger');
        return ride;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        client_device_service_1.ClientDeviceService,
        trip_repository_1.TripRepository,
        payment_repository_1.PaymentRepository,
        coin_repository_1.CoinRepository,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map