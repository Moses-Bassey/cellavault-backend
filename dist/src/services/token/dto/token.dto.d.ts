import { TokenSubject } from 'src/enums/token.enum';
export declare class CreateTokenDto {
    email?: string;
    phoneNo?: string;
    expiry: Date;
    subject: TokenSubject;
}
export declare class VerifyCustomTokenDto {
    token: string;
    email: string;
    phoneNo: string;
}
