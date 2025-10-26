import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto, SignupEmail, SignupPhone, SignUpUserDto, VerifyOtpDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpPhoneNo(input: SignupPhone): Promise<import("../../utils/response.utils").ApiResponse<null> | import("../../utils/response.utils").ApiResponse<{
        otpToken: string;
    }>>;
    signUpEmail(input: SignupEmail): Promise<import("../../utils/response.utils").ApiResponse<null> | import("../../utils/response.utils").ApiResponse<{}>>;
    verifyOtp(input: VerifyOtpDto): Promise<import("../../utils/response.utils").ApiResponse<null> | import("../../utils/response.utils").ApiResponse<{
        token: string;
    }>>;
    signUp(input: SignUpUserDto): Promise<import("../../utils/response.utils").ApiResponse<null> | import("../../utils/response.utils").ApiResponse<{
        email: string;
        userType: import("../../enums").UserType;
        id: string;
        token: string;
    }>>;
    login(input: LoginUserDto): Promise<import("../../utils/response.utils").ApiResponse<null> | import("../../utils/response.utils").ApiResponse<{
        token: string;
        userType: import("../../enums").UserType;
        userId: string;
        email: string;
    }>>;
    forgotPassword(input: ForgotPasswordDto, req: ExpressRequest): Promise<import("../../utils/response.utils").ApiResponse<null> | import("../../utils/response.utils").ApiResponse<{}>>;
    resetPassword(input: ResetPasswordDto): Promise<import("../../utils/response.utils").ApiResponse<{}>>;
    changePassword(input: ChangePasswordDto, req: ExpressRequest & {
        user: any;
    }): Promise<import("../../utils/response.utils").ApiResponse<null> | import("../../utils/response.utils").ApiResponse<{}>>;
}
