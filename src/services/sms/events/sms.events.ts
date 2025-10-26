export class SignUpOtpSmsEvent {
  constructor(
    public readonly phoneNumber: string,
    public readonly otpCode: string,
  ) {}
}

export class ForgotPasswordOtpSmsEvent {
  constructor(
    public readonly phoneNumber: string,
    public readonly otpCode: string,
  ) {}
}

