import { User } from '../entities/user.entity';
import { UserType } from '../../../enums/user-type.enum';
export declare class UserRepository {
    private userModel;
    constructor(userModel: typeof User);
    findByIdentity(identity: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    fetchUser(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phoneNo: string): Promise<User | null>;
    findByEmailAndRole(email: string, userType: UserType): Promise<User | null>;
    findActiveUsers(isDisabled: boolean): Promise<User[] | null>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, userData: Partial<User>): Promise<[number, User[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
    findWithCountry(email: string, userType: UserType): Promise<User | null>;
    findAll(options: {
        search?: string;
        status?: boolean;
        limit: number;
        offset: number;
    }): Promise<User[]>;
    countAll(): Promise<User[] | null>;
    countFiltered(options: {
        search?: string;
        status?: boolean;
    }): Promise<number>;
    findAllBanned(isDisabled: boolean): Promise<User[]>;
    getNewUsersForMonth(year: number, month: number): Promise<User[]>;
}
