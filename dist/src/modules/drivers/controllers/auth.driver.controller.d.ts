import type { Request as ExpressRequest } from 'express';
import { ChangePasswordDto, ForgotPasswordDto, LoginOtpDto, LoginUserDto, ResetPasswordDto, SignupEmail, SignupPhone, VerifyOtpDto } from '../dto/auth.driver.dto';
import { AuthDriverService } from '../services/auth.driver.service';
import { CreateAccountDto } from '../dto/auth.driver.dto';
export declare class AuthDriverController {
    private readonly authService;
    constructor(authService: AuthDriverService);
    signUpPhoneNo(input: SignupPhone): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<{
        otpToken: string;
    }>>;
    signUpEmail(input: SignupEmail): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<{}>>;
    verifyOtp(input: VerifyOtpDto): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<{
        token: string;
    }>>;
    signUp(input: CreateAccountDto): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<import("../interfaces/driver.interfaces").ILogin>>;
    login(input: LoginUserDto): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<import("../interfaces/driver.interfaces").ILogin>>;
    loginOtp(input: LoginOtpDto): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<{
        email: string;
        userType: import("../../../enums").UserType;
        id: string;
        token: string;
    }>>;
    forgotPassword(input: ForgotPasswordDto, req: ExpressRequest): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<{}>>;
    resetPassword(input: ResetPasswordDto): Promise<import("../../../utils/response.utils").ApiResponse<{}>>;
    changePassword(input: ChangePasswordDto, req: ExpressRequest & {
        user: any;
    }): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<{}>>;
}
