export declare class CreatePasscodeDto {
    code: string;
}
export declare class ChangePasscodeDto {
    newPassCode: string;
    oldPasscode: string;
}
export declare class VerifyPasscodeDto {
    code: string;
}
export declare class ResetPasscodeDto {
    otp: string;
    newCode: string;
    confirmCode: string;
}
