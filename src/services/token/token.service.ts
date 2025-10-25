import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isAfter } from 'date-fns';
import { CreateTokenDto, VerifyCustomTokenDto } from './dto/token.dto';
import { TokenRepository } from './repositories/token.repository';
import { ITokenInterface } from './interface/IToken.interface';
import * as randomstring from 'randomstring';
import { IOTPInterface } from './interface/IOTP.interface';
import { TokenSubject } from 'src/enums/token.enum';
import { Token } from './entities/token.entity';


@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
  ) {}


  public async validateOtp(input: IOTPInterface): Promise<{ token: string }> {
    const { token, email, phoneNo, subject: subject } = input;
    
    let userToken: Token | null = null;
    
    switch(subject){
      case TokenSubject.SIGN_UP_EMAIL:
        userToken = await this.tokenRepository.findByEmailToken(token, email || "");
        break;
      case TokenSubject.SIGN_UP_PHONE:
        userToken = await this.tokenRepository.findByPhoneToken(token, phoneNo || "");
        break;
      default:
        throw new BadRequestException('Invalid OTP Subject');
    }

    if (!userToken) throw new BadRequestException('Invalid OTP');

    const isExpired = isAfter(new Date(), userToken.expiry);
    if (isExpired) {
      await this.deleteOTPtoken(userToken.id);
      throw new BadRequestException('Invalid or expired Token')
    }

    return { token: userToken.token };
  }

  public async verifySignUpOTP(dto: IOTPInterface): Promise<{ token: string }> {
    const { token, email, phoneNo, subject: otpSubject } = dto;
    
    let userToken: Token | null = null;
    
    switch(otpSubject){
      case TokenSubject.SIGN_UP_EMAIL:
        userToken = await this.tokenRepository.findByEmailToken(token, email || "");
        break;
      case TokenSubject.SIGN_UP_PHONE:
        userToken = await this.tokenRepository.findByPhoneToken(token, phoneNo || "");
        break;
      default:
        throw new BadRequestException('Invalid OTP Subject');
    }

    if (!userToken) throw new BadRequestException('Invalid OTP');

    await this.deleteOTPtoken(userToken.id);

    return { token: userToken.token };
  }

  async generateOTPtoken(payload: CreateTokenDto) : Promise<ITokenInterface> {
    const token = randomstring.generate({
      length: 6,
      charset: 'numeric',
    })
    
    return await this.tokenRepository.create({
      ...payload,
      token: token
    });
  }

  async generateJWTtoken(payload: any) {
    const expiresIn = this.configService.get<string>('app.jwtTokenExpiry') || '1h';
    return await this.jwtService.signAsync(payload, { expiresIn: Number(expiresIn) });
  }

  async verifyJWTtoken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new BadRequestException('Unable To Verify Token');
    }
  }

  private async deleteOTPtoken(id: string) {
    await this.tokenRepository.delete(id);
  }
}
