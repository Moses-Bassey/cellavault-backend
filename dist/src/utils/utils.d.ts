import { UserLoginIdentityType } from 'src/enums';
export declare class Utils {
    static getLoginIdentityType(identity: string): UserLoginIdentityType;
    static normalizeCountryPhone(countryCode: string, phoneNo: string, phoneNoLength: number): string;
    static phoneSMSFormat(phone: string): string;
}
