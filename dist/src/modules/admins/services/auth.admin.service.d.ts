import { TokenService } from 'src/services/token/token.service';
import { AdminRepository } from '../repositories/admin.repository';
import { Admin } from '../entities/admin.entity';
import { ClientDeviceService } from '../../client-devices/services/client-device.service';
import { ClientDeviceEventEmitter } from '../../client-devices/emitters/client-device.emitter';
import { IAdminLoginData } from '../../../shared/interfaces/auth.interface';
import { UserType } from '../../../enums/user-type.enum';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { CreateAdminDto, AdminLoginDto, LoginOtpDto } from '../dto/admin.dto';
export declare class AuthAdminService {
    private readonly adminRepository;
    private readonly clientDeviceService;
    private readonly emailEventService;
    private readonly tokenService;
    private readonly clientDeviceEventEmitter;
    private readonly logger;
    constructor(adminRepository: AdminRepository, clientDeviceService: ClientDeviceService, emailEventService: EmailEventService, tokenService: TokenService, clientDeviceEventEmitter: ClientDeviceEventEmitter);
    create(data: CreateAdminDto): Promise<Admin>;
    login(data: AdminLoginDto, request: Request): Promise<IAdminLoginData>;
    loginOtp(input: LoginOtpDto, request: Request): Promise<{
        email: string;
        adminType: UserType;
        id: string;
        token: string;
    }>;
    deleteAdminAccount(email: string, password: string): Promise<null>;
    checkEmailExist(email: string): Promise<Admin | null>;
    private validateClientDevice;
    private buildLoginResponse;
    private getClientIp;
}
