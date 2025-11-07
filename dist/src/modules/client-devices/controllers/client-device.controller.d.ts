import { ClientDeviceService } from '../services/client-device.service';
export declare class ClientDeviceController {
    private readonly clientDeviceService;
    constructor(clientDeviceService: ClientDeviceService);
    findAll(): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/client-device.entity").ClientDevice[]>>;
    getMyDevices(req: any): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/client-device.entity").ClientDevice[]> | {
        message: string;
        statusCode: number;
    }>;
}
