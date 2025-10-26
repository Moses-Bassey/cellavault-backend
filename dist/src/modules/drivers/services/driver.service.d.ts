import { Driver } from '../entities/driver.entity';
import { DriverRepository } from '../repositories/driver.repository';
export declare class DriverService {
    private readonly driverRepository;
    constructor(driverRepository: DriverRepository);
    dashboard(): Promise<void>;
    findById(id: string): Promise<Driver | null>;
    findByIdentity(identity: string): Promise<Driver | null>;
    findByEmail(email: string): Promise<Driver | null>;
    findAll(options?: any): Promise<Driver[]>;
    update(id: string, driverData: Partial<Driver>): Promise<[number, Driver[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
    findAvailableDrivers(): Promise<Driver[]>;
    findNearbyDrivers(latitude: number, longitude: number, radius?: number): Promise<Driver[]>;
}
