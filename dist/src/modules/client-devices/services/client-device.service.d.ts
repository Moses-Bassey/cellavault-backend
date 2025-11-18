import { ClientDevice } from '../entities/client-device.entity';
import { ClientDeviceRepository } from '../repositories/client-device.repository';
import { UserType } from 'src/enums';
export declare class ClientDeviceService {
    private readonly clientDeviceRepository;
    constructor(clientDeviceRepository: ClientDeviceRepository);
    findById(id: string): Promise<ClientDevice | null>;
    findByUserId(userId: string): Promise<ClientDevice[]>;
    findByIpAddress(ipAddress: string): Promise<ClientDevice[]>;
    findByUserIdAndDeviceToken(userId: string, deviceFCMToken: string): Promise<ClientDevice | null>;
    findByDriverIdAndDeviceToken(driverId: string, deviceFCMToken: string): Promise<ClientDevice | null>;
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
        driverId?: string;
        userType?: UserType;
    }): Promise<ClientDevice>;
    updateDeviceToken(clientDeviceId: string, deviceFCMToken: string): Promise<ClientDevice>;
}
