import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Trip, TripStatus } from '../../trips/entities/trip.entity';
import { UserRepository } from '../repositories/user.repository';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
import { TripRepository } from '../../trips/repositories/trip.repository';
import { PaymentRepository } from '../../payment/repositories/payment.repository';
import { CoinRepository } from '../../payment/repositories/coin.repository';
import { PassengerAccountDto, PassengerActivitySummaryDto, PassengerRideRowDto, CursorPageDto } from '../../../shared/dto/user.dto';
import { IDashboard, IDashboardInput } from 'src/shared/interfaces/dashbaord.interface';
export declare class UserService {
    private readonly userRepository;
    private readonly clientDeviceService;
    private readonly rides;
    private readonly payments;
    private readonly coins;
    private readonly configService;
    constructor(userRepository: UserRepository, clientDeviceService: ClientDeviceService, rides: TripRepository, payments: PaymentRepository, coins: CoinRepository, configService: ConfigService);
    private toAccountDto;
    fetchUser(id: string): Promise<User | null>;
    dashboard(data: IDashboardInput, userId: string): Promise<IDashboard>;
    findAll(options: {
        search?: string;
        status?: boolean;
        limit: number;
        offset: number;
    }): Promise<User[]>;
    countFiltered(options: {
        search?: string;
        status?: boolean;
    }): Promise<number>;
    update(id: string, userData: Partial<User>): Promise<number | null>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
    countActiveUsers(): Promise<number | null>;
    countAllUsers(): Promise<number | null>;
    countBannedUsers(): Promise<number | null>;
    getNewUsersForMonth(): Promise<number>;
    getPassengerAccount(passengerId: string): Promise<PassengerAccountDto>;
    updatePassengerAccount(passengerId: string, patch: {
        fullName?: string;
        email?: string;
        phoneNo?: string;
        imageUrl?: string;
        shortDescription?: string;
    }): Promise<PassengerAccountDto>;
    suspendPassenger(passengerId: string, body: {
        reason?: string;
    }): Promise<{
        ok: boolean;
    }>;
    unsuspendPassenger(passengerId: string): Promise<{
        ok: boolean;
    }>;
    getPassengerActivitySummary(params: {
        passengerId: string;
        from?: string;
        to?: string;
    }): Promise<PassengerActivitySummaryDto>;
    listPassengerRides(params: {
        passengerId: string;
        from?: string;
        to?: string;
        status?: TripStatus;
        limit?: number;
        cursor?: string;
    }): Promise<CursorPageDto<PassengerRideRowDto>>;
    getRideDetails(passengerId: string, rideId: string): Promise<Trip>;
}
