import { UserType } from '../../../enums/user-type.enum';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { SmsEventService } from 'src/services/sms/sms-event.service';
import { TokenService } from 'src/services/token/token.service';
import { JwtAuthPayload } from '../../auth/auth.interface';
import { ChangePasswordDto, ForgotPasswordDto, LoginOtpDto, LoginDriverDto, ResetPasswordDto, SignupEmail, SignupPhone, CreateAccountDto, VerifyOtpDto } from '../dto/auth.driver.dto';
import { CountryService } from '../../countries/services/country.service';
import { DriverRepository } from '../repositories/driver.repository';
import { ClientDeviceService } from '../../client-devices/services/client-device.service';
import { Driver } from '../entities/driver.entity';
import { IDriverLoginData } from '../../../shared/interfaces/auth.interface';
export declare class AuthDriverService {
    private readonly driverRepository;
    private readonly tokenService;
    private readonly emailEventService;
    private readonly smsEventService;
    private readonly countryService;
    private readonly clientDeviceService;
    constructor(driverRepository: DriverRepository, tokenService: TokenService, emailEventService: EmailEventService, smsEventService: SmsEventService, countryService: CountryService, clientDeviceService: ClientDeviceService);
    deleteUserAccount(identity: string, password: string): Promise<null>;
    signUpPhoneNo(input: SignupPhone): Promise<{}>;
    signUpEmail(input: SignupEmail): Promise<null>;
    verifyOtp(input: VerifyOtpDto): Promise<VerifyOtpDto>;
    createAccount(input: CreateAccountDto): Promise<IDriverLoginData>;
    login(input: LoginDriverDto): Promise<IDriverLoginData>;
    loginOtp(input: LoginOtpDto): Promise<{
        email: string;
        userType: UserType;
        id: string;
        token: string;
    }>;
    forgotPassword(input: ForgotPasswordDto): Promise<null>;
    resetPassword(input: ResetPasswordDto): Promise<null>;
    changePassword(input: ChangePasswordDto, authUser: JwtAuthPayload): Promise<null>;
    checkEmailExist(email: string): Promise<Driver | null>;
    private getBaseUrlFromRequest;
}
