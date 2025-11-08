import { Passcode } from '../entities/passcode.entity';
import { UserType } from '../../../enums/user-type.enum';
export declare class PasscodeRepository {
    private passcodeModel;
    constructor(passcodeModel: typeof Passcode);
    findByUserId(userId: string, userType: UserType): Promise<Passcode | null>;
    create(passcodeData: Partial<Passcode>): Promise<Passcode>;
    update(userId: string, userType: UserType, passcodeData: Partial<Passcode>): Promise<[number, Passcode[]]>;
    delete(userId: string, userType: UserType): Promise<number>;
}
