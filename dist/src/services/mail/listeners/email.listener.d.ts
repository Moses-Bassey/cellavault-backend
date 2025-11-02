import { MailerService } from '@nestjs-modules/mailer';
import { SignUpOtpEmailEvent, ForgetPasswordEmailEvent, WelcomeEmailEvent, BookingConfirmationEmailEvent, DriverVerificationEmailEvent, PasswordChangedEmailEvent, NewLoginEmailEvent, NewDeviceLoginOtpEmailEvent } from '../events/email.events';
export declare class EmailEventListener {
    private readonly mailerService;
    private readonly logger;
    constructor(mailerService: MailerService);
    handleSignUpOtpEvent(event: SignUpOtpEmailEvent): Promise<void>;
    handleForgetPasswordEvent(event: ForgetPasswordEmailEvent): Promise<void>;
    handleWelcomeEvent(event: WelcomeEmailEvent): Promise<void>;
    handleBookingConfirmationEvent(event: BookingConfirmationEmailEvent): Promise<void>;
    handleDriverVerificationEvent(event: DriverVerificationEmailEvent): Promise<void>;
    handlePasswordChangedEvent(event: PasswordChangedEmailEvent): Promise<void>;
    handleNewLoginEvent(event: NewLoginEmailEvent): Promise<void>;
    handleNewDeviceLoginOtpEvent(event: NewDeviceLoginOtpEmailEvent): Promise<void>;
}
