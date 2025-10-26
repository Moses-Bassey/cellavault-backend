import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    dashboard(): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByIdentity(identity: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(options?: any): Promise<User[]>;
    update(id: string, userData: Partial<User>): Promise<[number, User[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
}
