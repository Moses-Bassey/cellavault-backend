import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from './dto/token.dto';
import { TokenRepository } from './repositories/token.repository';
import { ITokenInterface } from './interface/IToken.interface';
import { IOTPInterface } from './interface/IOTP.interface';
export declare class TokenService {
    private readonly jwtService;
    private readonly tokenRepository;
    private readonly configService;
    constructor(jwtService: JwtService, tokenRepository: TokenRepository, configService: ConfigService);
    validateOtp(input: IOTPInterface): Promise<{
        token: string;
    }>;
    validatePasswordResetOtp(input: IOTPInterface): Promise<{
        token: string;
    }>;
    verifyOTP(input: IOTPInterface): Promise<{
        token: string;
    }>;
    verifySignUpOTP(dto: IOTPInterface): Promise<{
        token: string;
    }>;
    generateOTPtoken(payload: CreateTokenDto): Promise<ITokenInterface & {
        token: string;
    }>;
    generateJWTtoken(payload: any): Promise<string>;
    verifyJWTtoken(token: string): Promise<any>;
    private deleteOTPtoken;
}
