import { PasscodeRepository } from '../repositories/passcode.repository';
import { UserType } from 'src/enums/user-type.enum';
import { CreatePasscodeDto, VerifyPasscodeDto, ResetPasscodeDto, ChangePasscodeDto } from '../dto/passcode.dto';
import { Passcode } from '../entities/passcode.entity';
import { UserRepository } from '../../users/repositories/user.repository';
import { DriverRepository } from '../../drivers/repositories/driver.repository';
import { TokenService } from 'src/services/token/token.service';
import { EmailEventService } from 'src/services/mail/email-event.service';
export declare class PasscodeService {
    private readonly passcodeRepository;
    private readonly userRepository;
    private readonly driverRepository;
    private readonly tokenService;
    private readonly emailEventService;
    constructor(passcodeRepository: PasscodeRepository, userRepository: UserRepository, driverRepository: DriverRepository, tokenService: TokenService, emailEventService: EmailEventService);
    createPasscode(userId: string, userType: UserType, input: CreatePasscodeDto): Promise<Passcode>;
    changePasscode(userId: string, userType: UserType, input: ChangePasscodeDto): Promise<null>;
    getPasscode(userId: string, userType: UserType): Promise<Passcode | null>;
    verifyPasscode(userId: string, userType: UserType, input: VerifyPasscodeDto): Promise<boolean>;
    requestResetPasscode(userId: string, userType: UserType): Promise<null>;
    resetPasscode(userId: string, userType: UserType, email: string, input: ResetPasscodeDto): Promise<Passcode>;
}
