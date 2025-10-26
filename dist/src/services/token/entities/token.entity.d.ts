import { Model } from 'sequelize-typescript';
import { TokenSubject, TokenType } from 'src/enums/token.enum';
export declare class Token extends Model<Token> {
    id: string;
    subject: TokenSubject;
    token: string;
    email: string;
    phoneNo: string;
    tokenType: TokenType;
    expiry: Date;
    createdAt: Date;
    updatedAt: Date;
}
