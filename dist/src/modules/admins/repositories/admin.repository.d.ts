import { Admin } from '../entities/admin.entity';
export declare class AdminRepository {
    private readonly adminModel;
    constructor(adminModel: typeof Admin);
    create(adminData: Partial<Admin>): Promise<Admin>;
    findById(id: string): Promise<Admin | null>;
    findByEmail(email: string): Promise<Admin | null>;
    findAll(options?: {
        limit?: number;
        offset?: number;
    }): Promise<Admin[]>;
    update(id: string, updates: Partial<Admin>): Promise<[number, Admin[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
}
