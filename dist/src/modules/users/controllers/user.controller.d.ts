import { UserService } from '../services/user.service';
import { TripStatus } from '../../trips/entities/trip.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getPassenger(passengerId: string): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/dto/user.dto").PassengerAccountDto>>;
    updatePassenger(passengerId: string, body: {
        fullName?: string;
        email?: string;
        phoneNo?: string;
        imageUrl?: string;
        shortDescription?: string;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/dto/user.dto").PassengerAccountDto>>;
    suspendPassenger(passengerId: string, body: {
        reason?: string;
    }): Promise<import("src/utils/response.utils").ApiResponse<{
        ok: boolean;
    }>>;
    unsuspendPassenger(passengerId: string): Promise<import("src/utils/response.utils").ApiResponse<{
        ok: boolean;
    }>>;
    getActivitySummary(passengerId: string, from?: string, to?: string): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/dto/user.dto").PassengerActivitySummaryDto>>;
    listRides(passengerId: string, from?: string, to?: string, status?: TripStatus, limit?: string, cursor?: string): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/dto/user.dto").CursorPageDto<import("../../../shared/dto/user.dto").PassengerRideRowDto>>>;
    getRideDetails(passengerId: string, rideId: string): Promise<import("src/utils/response.utils").ApiResponse<import("../../trips/entities/trip.entity").Trip>>;
}
