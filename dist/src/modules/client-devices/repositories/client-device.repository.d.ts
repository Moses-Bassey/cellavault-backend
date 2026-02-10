import { ClientDevice } from '../entities/client-device.entity';
export declare class ClientDeviceRepository {
    private clientDeviceModel;
    constructor(clientDeviceModel: typeof ClientDevice);
    findById(id: string): Promise<ClientDevice | null>;
    findByUserId(userId: string): Promise<ClientDevice[]>;
    findByIpAddress(ipAddress: string): Promise<ClientDevice[]>;
    findByDeviceToken(deviceFCMToken: string): Promise<ClientDevice | null>;
    findAll(options?: any): Promise<ClientDevice[]>;
    findByAdminIdAndDeviceToken(adminId: string, deviceFCMToken: string): Promise<ClientDevice | null>;
    create(clientDeviceData: Partial<ClientDevice>): Promise<ClientDevice>;
    update(id: string, clientDeviceData: Partial<ClientDevice>): Promise<[number, ClientDevice[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
    findByUserAndDevice(userId: string, deviceFCMToken: string): Promise<ClientDevice | null>;
    findByDriverAndDevice(driverId: string, deviceFCMToken: string): Promise<ClientDevice | null>;
    updateOrCreateDevice(deviceData: Partial<ClientDevice>): Promise<ClientDevice>;
}
