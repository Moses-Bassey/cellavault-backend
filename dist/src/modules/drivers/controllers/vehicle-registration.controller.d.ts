import { VehicleRegistration } from '../entities/vehicle-registration.entity';
import { VehicleRegistrationService } from '../services/vehicle-registration.service';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import type { Request as ExpressRequest } from 'express';
import { CreateVehicleRegistrationDto } from '../dto/vehicle-registration.dto';
export declare class VehicleRegistrationController {
    private readonly vehicleRegistrationService;
    constructor(vehicleRegistrationService: VehicleRegistrationService);
    create(vehicleRegistrationData: CreateVehicleRegistrationDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<CreateVehicleRegistrationDto>>;
    findByDriverId(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<VehicleRegistration[]>>;
    deleteVehicleRegistration(req: ExpressRequest & {
        user: JwtAuthPayload;
    }, id: string): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
}
