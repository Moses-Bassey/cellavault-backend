import { Driver } from '../entities/driver.entity';
import { DriverRepository } from '../repositories/driver.repository';
import { IDashboard } from 'src/shared/interfaces/dashbaord.interface';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
export declare class DriverService {
    private readonly driverRepository;
    private readonly clientDeviceService;
    constructor(driverRepository: DriverRepository, clientDeviceService: ClientDeviceService);
    dashboard(data: {
        deviceFCMToken: string;
        ipAddress: string;
        name: string;
    }, userId: string): Promise<IDashboard>;
    fetchDriver(id: string): Promise<Driver | null>;
    findByIdentity(identity: string): Promise<Driver | null>;
    findByEmail(email: string): Promise<Driver | null>;
    findAll(options?: any): Promise<Driver[]>;
    update(id: string, driverData: Partial<Driver>): Promise<[number, Driver[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
}
