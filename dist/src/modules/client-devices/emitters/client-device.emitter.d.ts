import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserType } from 'src/enums';
export declare class ClientDeviceEventEmitter {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    emitAddDeviceToken(payload: {
        adminId?: string;
        userId?: string;
        driverId?: string;
        ipAddress: string;
        deviceFCMToken?: string | null;
        name?: string | null;
        userType?: UserType | null;
    }): void;
}
