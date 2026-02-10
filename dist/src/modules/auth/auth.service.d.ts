import { MailService } from 'src/services/mail/mail.service';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { SmsEventService } from 'src/services/sms/sms-event.service';
import { TokenService } from 'src/services/token/token.service';
import { UserRepository } from '../users/repositories/user.repository';
import { CountryService } from '../countries/services/country.service';
import { UserService } from '../users/services/user.service';
import { ClientDeviceService } from '../client-devices/services/client-device.service';
export declare class AuthService {
    private readonly userRepository;
    private mailService;
    private tokenService;
    private emailEventService;
    private smsEventService;
    private countryService;
    private userService;
    private clientDeviceService;
    constructor(userRepository: UserRepository, mailService: MailService, tokenService: TokenService, emailEventService: EmailEventService, smsEventService: SmsEventService, countryService: CountryService, userService: UserService, clientDeviceService: ClientDeviceService);
}
