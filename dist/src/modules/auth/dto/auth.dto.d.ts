import { TokenSubject } from 'src/enums/token.enum';
export declare class SignUpUserDto {
    readonly email: string;
    password: string;
    phoneNo: string;
    otpPhone: string;
    otpEmail: string;
    country: string;
    readonly fullName: string;
}
export declare class LoginUserDto {
    readonly identity: string;
    readonly password: string;
}
export declare class ForgotPasswordDto {
    readonly email: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
    confirmPassword: string;
    email: string;
}
export declare class ChangePasswordDto {
    readonly oldPassword: string;
    readonly newPassword: string;
    readonly confirmPassword: string;
}
export declare class ResendOtpDto {
    readonly email: string;
}
export declare class SignupEmail {
    readonly email: string;
}
export declare class SignupPhone {
    readonly phoneNo: string;
}
export declare class VerifyOtpDto {
    token: string;
    email: string;
    phoneNo: string;
    readonly subject: TokenSubject;
}
export declare class SignUserDto {
    readonly fullName: string;
    readonly email: string;
    readonly phoneNo: string;
    readonly country: string;
    readonly password: string;
}
