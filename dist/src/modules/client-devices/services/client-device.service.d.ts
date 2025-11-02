import { ClientDevice } from '../entities/client-device.entity';
import { ClientDeviceRepository } from '../repositories/client-device.repository';
import { ApiResponse } from 'src/utils/response.utils';
export declare class ClientDeviceService {
    private readonly clientDeviceRepository;
    constructor(clientDeviceRepository: ClientDeviceRepository);
    findById(id: string): Promise<ClientDevice | null>;
    findByUserId(userId: string): Promise<ApiResponse<null> | ApiResponse<ClientDevice[]>>;
    findByIpAddress(ipAddress: string): Promise<ApiResponse<null> | ApiResponse<ClientDevice[]>>;
    findByUserIdAndDeviceToken(userId: string, deviceFCMToken: string): Promise<ClientDevice | null>;
    findAll(options?: any): Promise<ApiResponse<null> | ApiResponse<ClientDevice[]>>;
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
    }): Promise<ApiResponse<null> | ApiResponse<ClientDevice>>;
    updateDeviceToken(deviceId: string, deviceFCMToken: string): Promise<ApiResponse<null> | ApiResponse<ClientDevice>>;
}
