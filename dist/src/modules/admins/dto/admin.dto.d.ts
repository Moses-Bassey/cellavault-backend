import { AdminType } from '../../../enums/user-type.enum';
export declare class CreateAdminDto {
    fullName: string;
    email: string;
    password: string;
}
export declare class UpdateAdminDto {
    fullName?: string;
    email?: string;
    password?: string;
    role: AdminType;
    isVerified?: boolean;
    isActive?: boolean;
}
export declare class AdminLoginDto {
    email: string;
    password: string;
}
export declare class LoginOtpDto {
    readonly email: string;
    readonly password: string;
    otp: string;
    deviceInfo: {
        deviceFCMToken?: string;
        name?: string;
    };
    readonly country?: string;
}
