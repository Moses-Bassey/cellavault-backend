import { ClientDeviceService } from '../services/client-device.service';
import { UserType } from 'src/enums';
export declare class ClientDeviceListener {
    private readonly clientDeviceService;
    constructor(clientDeviceService: ClientDeviceService);
    handleAddDeviceToken(payload: {
        adminId?: string;
        userId?: string;
        driverId?: string;
        ipAddress: string;
        deviceFCMToken?: string | null;
        name?: string | null;
        userType?: UserType;
    }): Promise<void>;
}
