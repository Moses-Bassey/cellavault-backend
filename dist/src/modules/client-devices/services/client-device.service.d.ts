import { ClientDevice } from '../entities/client-device.entity';
import { ClientDeviceRepository } from '../repositories/client-device.repository';
export declare class ClientDeviceService {
    private readonly clientDeviceRepository;
    constructor(clientDeviceRepository: ClientDeviceRepository);
    findById(id: string): Promise<ClientDevice | null>;
    findByUserId(userId: string): Promise<ClientDevice[]>;
    findByIpAddress(ipAddress: string): Promise<ClientDevice[]>;
    findByUserIdAndDeviceToken(userId: string, deviceFCMToken: string): Promise<ClientDevice | null>;
    findAll(options?: any): Promise<ClientDevice[]>;
    create(clientDeviceData: Partial<ClientDevice>): Promise<ClientDevice>;
    update(id: string, clientDeviceData: Partial<ClientDevice>): Promise<[number, ClientDevice[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
    registerDevice(deviceData: {
        ipAddress: string;
        deviceFCMToken?: string;
        name?: string;
        userId?: string;
        userType?: 'SUPER_ADMIN' | 'PEPP_ADMIN' | 'USER';
    }): Promise<ClientDevice>;
    updateDeviceToken(deviceId: string, deviceFCMToken: string): Promise<ClientDevice>;
}
