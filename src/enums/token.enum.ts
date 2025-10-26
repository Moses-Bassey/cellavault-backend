export enum TokenType {
    OTP = 'OTP',
    JWT = 'JWT',
    REFRESH = 'REFRESH'
}

export enum TokenSubject {
    FORGOT_PASSWORD="PASSWORD_RESET",
    SIGN_UP_PHONE="SIGN_UP_PHONE",
    SIGN_UP_EMAIL="SIGN_UP_EMAIL"
}