import { Driver } from '../entities/driver.entity';
import { UserType } from '../../../enums/user-type.enum';
export declare class DriverRepository {
    private driverModel;
    constructor(driverModel: typeof Driver);
    findByIdentity(identity: string): Promise<Driver | null>;
    findById(id: string): Promise<Driver | null>;
    findByEmail(email: string): Promise<Driver | null>;
    findByPhone(phoneNo: string): Promise<Driver | null>;
    findByEmailAndRole(email: string, userType: UserType): Promise<Driver | null>;
    create(driverData: Partial<Driver>): Promise<Driver>;
    update(id: string, driverData: Partial<Driver>): Promise<[number, Driver[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
    findWithCountry(email: string, userType: UserType): Promise<Driver | null>;
    findAll(options?: any): Promise<Driver[]>;
    findAvailableDrivers(): Promise<Driver[]>;
    findNearbyDrivers(latitude: number, longitude: number, radius?: number): Promise<Driver[]>;
}
