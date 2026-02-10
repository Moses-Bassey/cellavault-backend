import { CreateAdminDto, AdminLoginDto, LoginOtpDto } from '../dto/admin.dto';
import { AuthAdminService } from '../services/auth.admin.service';
export declare class AuthAdminController {
    private readonly authService;
    constructor(authService: AuthAdminService);
    signUp(input: CreateAdminDto): Promise<import("src/utils/response.utils").ApiResponse<import("../entities").Admin>>;
    login(input: AdminLoginDto, request: Request): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/interfaces/auth.interface").IAdminLoginData>>;
    loginOtp(input: LoginOtpDto, request: Request): Promise<import("src/utils/response.utils").ApiResponse<{
        email: string;
        adminType: import("../../../enums").UserType;
        id: string;
        token: string;
    }>>;
    delete(userCredentials: {
        email: string;
        password: string;
    }): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
}
