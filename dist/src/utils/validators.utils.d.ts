import { UserLoginIdentityType } from 'src/enums';
export declare class Validators {
    static validateEmail(email: string): string;
    static getLoginIdentity(identity: string): UserLoginIdentityType;
    static validateUuid(value: string): string;
}
