import { UserType } from '../../../enums/user-type.enum';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { SmsEventService } from 'src/services/sms/sms-event.service';
import { TokenService } from 'src/services/token/token.service';
import { ApiResponse } from 'src/utils/response.utils';
import { JwtAuthPayload } from '../../auth/auth.interface';
import { ChangePasswordDto, ForgotPasswordDto, LoginOtpDto, LoginUserDto, ResetPasswordDto, SignupEmail, SignupPhone, CreateAccountDto, VerifyOtpDto } from '../dto/auth.driver.dto';
import { CountryService } from '../../countries/services/country.service';
import { DriverRepository } from '../repositories/driver.repository';
import { ClientDeviceService } from '../../client-devices/services/client-device.service';
import { Driver } from '../entities/driver.entity';
import { ILogin as ILoginData } from '../interfaces/driver.interfaces';
export declare class AuthDriverService {
    private readonly driverRepository;
    private readonly tokenService;
    private readonly emailEventService;
    private readonly smsEventService;
    private readonly countryService;
    private readonly clientDeviceService;
    constructor(driverRepository: DriverRepository, tokenService: TokenService, emailEventService: EmailEventService, smsEventService: SmsEventService, countryService: CountryService, clientDeviceService: ClientDeviceService);
    signUpPhoneNo(input: SignupPhone): Promise<ApiResponse<{
        otpToken: string;
    }> | ApiResponse<null>>;
    signUpEmail(input: SignupEmail): Promise<ApiResponse<null> | ApiResponse<{}>>;
    verifyOtp(input: VerifyOtpDto): Promise<ApiResponse<null> | ApiResponse<{
        token: string;
    }>>;
    createAccount(input: CreateAccountDto): Promise<ApiResponse<null> | ApiResponse<ILoginData>>;
    login(input: LoginUserDto): Promise<ApiResponse<null> | ApiResponse<ILoginData>>;
    loginOtp(input: LoginOtpDto): Promise<ApiResponse<null> | ApiResponse<{
        email: string;
        userType: UserType;
        id: string;
        token: string;
    }>>;
    forgotPassword(input: ForgotPasswordDto): Promise<ApiResponse<null> | ApiResponse<{}>>;
    resetPassword(input: ResetPasswordDto): Promise<ApiResponse<{}>>;
    changePassword(input: ChangePasswordDto, authUser: JwtAuthPayload): Promise<ApiResponse<null> | ApiResponse<{}>>;
    checkEmailExist(email: string): Promise<Driver | null>;
    private getBaseUrlFromRequest;
}
