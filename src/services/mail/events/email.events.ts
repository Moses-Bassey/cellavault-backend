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

export class PasswordChangedEmailEvent {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
    public readonly changedAt: string,
  ) {}
}

export class NewLoginEmailEvent {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
    public readonly deviceInfo: string,
    public readonly loginTime: string,
    public readonly ipAddress?: string,
  ) {}
}

export class NewDeviceLoginOtpEmailEvent {
  constructor(
    public readonly email: string,
    public readonly otpCode: string,
  ) {}
}

export class TutorInviteEmailEvent {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly loginUrl: string,
    public readonly temporaryPassword: string,
  ) {}
}
