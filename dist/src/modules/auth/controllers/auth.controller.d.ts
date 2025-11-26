import type { Request as ExpressRequest } from 'express';
import { AuthService } from '../auth.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginOtpDto, LoginUserDto, ResetPasswordDto, SignupEmail, SignupPhone, SignUpSocialUserDto, SignUpUserDto, VerifyOtpDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpPhoneNo(input: SignupPhone): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
    signUpEmail(input: SignupEmail): Promise<import("src/utils/response.utils").ApiResponse<null>>;
    verifyOtp(input: VerifyOtpDto): Promise<import("src/utils/response.utils").ApiResponse<VerifyOtpDto>>;
    verifyPasswordResetOtp(input: VerifyOtpDto): Promise<import("src/utils/response.utils").ApiResponse<VerifyOtpDto>>;
    signUp(input: SignUpUserDto): Promise<import("src/utils/response.utils").ApiResponse<{
        email: string;
        userType: import("../../../enums").UserType;
        id: string;
        token: string;
    }>>;
    signUpGoogle(input: SignUpSocialUserDto): Promise<import("src/utils/response.utils").ApiResponse<{
        email: string;
        userType: import("../../../enums").UserType;
        id: string;
        token: string;
    }>>;
    loginSocial(input: LoginUserDto): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/interfaces/auth.interface").IUserLoginData>>;
    login(input: LoginUserDto): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/interfaces/auth.interface").IUserLoginData>>;
    loginOtp(input: LoginOtpDto): Promise<import("src/utils/response.utils").ApiResponse<{
        email: string;
        userType: import("../../../enums").UserType;
        id: string;
        token: string;
    }>>;
    forgotPassword(input: ForgotPasswordDto, req: ExpressRequest): Promise<import("src/utils/response.utils").ApiResponse<null>>;
    resetPassword(input: ResetPasswordDto): Promise<import("src/utils/response.utils").ApiResponse<null>>;
    changePassword(input: ChangePasswordDto, req: ExpressRequest & {
        user: any;
    }): Promise<import("src/utils/response.utils").ApiResponse<null>>;
    logout(input: {
        deviceToken: any;
    }, req: ExpressRequest & {
        user: any;
    }): Promise<import("src/utils/response.utils").ApiResponse<null>>;
}
