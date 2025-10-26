import { User } from '../users/entities';
import { UserType } from '../../enums/user-type.enum';
import { MailService } from 'src/services/mail/mail.service';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { SmsEventService } from 'src/services/sms/sms-event.service';
import { TokenService } from 'src/services/token/token.service';
import { UserRepository } from '../users/repositories/user.repository';
import { JwtAuthPayload } from './auth.interface';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto, SignupEmail, SignupPhone, SignUpUserDto, VerifyOtpDto } from './dto/auth.dto';
import { CountryService } from '../countries/services/country.service';
import { UserService } from '../users/services/user.service';
export declare class AuthService {
    private readonly userRepository;
    private mailService;
    private tokenService;
    private emailEventService;
    private smsEventService;
    private countryService;
    private userService;
    constructor(userRepository: UserRepository, mailService: MailService, tokenService: TokenService, emailEventService: EmailEventService, smsEventService: SmsEventService, countryService: CountryService, userService: UserService);
    signUpPhoneNo(input: SignupPhone): Promise<import("src/utils/response.utils").ApiResponse<{
        otpToken: string;
    }> | import("src/utils/response.utils").ApiResponse<null>>;
    signUpEmail(input: SignupEmail): Promise<import("src/utils/response.utils").ApiResponse<null> | import("src/utils/response.utils").ApiResponse<{}>>;
    verifyOtp(input: VerifyOtpDto): Promise<import("src/utils/response.utils").ApiResponse<null> | import("src/utils/response.utils").ApiResponse<{
        token: string;
    }>>;
    signUp(input: SignUpUserDto): Promise<import("src/utils/response.utils").ApiResponse<null> | import("src/utils/response.utils").ApiResponse<{
        email: string;
        userType: UserType;
        id: string;
        token: string;
    }>>;
    login(input: LoginUserDto): Promise<import("src/utils/response.utils").ApiResponse<null> | import("src/utils/response.utils").ApiResponse<{
        token: string;
        userType: UserType;
        userId: string;
        email: string;
    }>>;
    forgotPassword(input: ForgotPasswordDto): Promise<import("src/utils/response.utils").ApiResponse<null> | import("src/utils/response.utils").ApiResponse<{}>>;
    resetPassword(input: ResetPasswordDto): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
    changePassword(input: ChangePasswordDto, authUser: JwtAuthPayload): Promise<import("src/utils/response.utils").ApiResponse<null> | import("src/utils/response.utils").ApiResponse<{}>>;
    checkEmailExist(email: string): Promise<User | null>;
    private getBaseUrlFromRequest;
}
