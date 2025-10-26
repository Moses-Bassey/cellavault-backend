export class SignUpOtpEmailEvent {
  constructor(
    public readonly email: string,
    public readonly otpCode: string,
    public readonly expiryDate: string,
  ) {}
}

export class ForgetPasswordEmailEvent {
  constructor(
    public readonly email: string,
    public readonly otpCode: string,
  ) {}
}

export class WelcomeEmailEvent {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
  ) {}
}

export class BookingConfirmationEmailEvent {
  constructor(
    public readonly email: string,
    public readonly bookingId: string,
    public readonly driverName: string,
    public readonly pickupTime: string,
    public readonly pickupLocation: string,
  ) {}
}

export class DriverVerificationEmailEvent {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
    public readonly verificationStatus: 'approved' | 'rejected',
    public readonly reason?: string,
  ) {}
}

export class PasswordChangedEmailEvent {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
    public readonly changedAt: string,
  ) {}
}
