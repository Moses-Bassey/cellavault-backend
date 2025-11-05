import { ClientDeviceService } from '../services/client-device.service';
export declare class ClientDeviceController {
    private readonly clientDeviceService;
    constructor(clientDeviceService: ClientDeviceService);
    findAll(): Promise<import("../../../utils/response.utils").ApiResponse<import("../entities/client-device.entity").ClientDevice[]> | import("../../../utils/response.utils").ApiResponse<null>>;
    getMyDevices(req: any): Promise<import("../../../utils/response.utils").ApiResponse<import("../entities/client-device.entity").ClientDevice[]> | import("../../../utils/response.utils").ApiResponse<null> | {
        message: string;
        statusCode: number;
    }>;
}
