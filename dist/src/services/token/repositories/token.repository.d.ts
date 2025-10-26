import { Token } from '../entities/token.entity';
import { TokenSubject } from 'src/enums/token.enum';
export declare class TokenRepository {
    private tokenModel;
    constructor(tokenModel: typeof Token);
    create(tokenData: Partial<Token>): Promise<Token>;
    findByToken(token: string): Promise<Token | null>;
    findByPhoneOrEmailToken(token: string, phoneNo: string, email: string): Promise<Token | null>;
    findByEmailToken(token: string, email: string): Promise<Token | null>;
    findByTokenEmailAndSubject(token: string, email: string, subject: TokenSubject): Promise<Token | null>;
    findByPhoneToken(token: string, phoneNo: string): Promise<Token | null>;
    delete(id: string): Promise<number>;
    deleteByToken(token: string): Promise<number>;
}
