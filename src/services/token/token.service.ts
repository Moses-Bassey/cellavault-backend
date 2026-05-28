import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { isAfter } from 'date-fns';
import { CreateTokenDto, VerifyCustomTokenDto } from './dto/token.dto';
import { TokenRepository } from './repositories/token.repository';
import { ITokenInterface } from './interface/IToken.interface';
import * as randomstring from 'randomstring';
import { IOTPInterface } from './interface/IOTP.interface';
import { TokenSubject, TokenType } from 'src/enums/token.enum';
import { Token } from './entities/token.entity';
import { PasswordUtil } from '../../utils/password.util';

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

    switch (subject) {
      case TokenSubject.SIGN_UP_EMAIL:
        userToken = await this.tokenRepository.findByEmailToken(
          token,
          email || '',
        );
        break;
      case TokenSubject.SIGN_UP_PHONE:
        userToken = await this.tokenRepository.findByPhoneToken(
          token,
          phoneNo || '',
        );
        break;
      default:
        throw new BadRequestException('Invalid OTP Subject');
    }

    if (!userToken) throw new BadRequestException('Invalid OTP');

    const isExpired = isAfter(new Date(), userToken.expiry);
    if (isExpired) {
      await this.deleteOTPtoken(userToken.id);
      throw new BadRequestException('Invalid or expired Token');
    }

    return { token: userToken.token };
  }

  public async validatePasswordResetOtp(
    input: IOTPInterface,
  ): Promise<{ token: string }> {
    const { token, email, subject } = input;

    let userToken: Token | null = null;

    userToken = await this.tokenRepository.findByEmailToken(token, email || '');

    if (!userToken) throw new BadRequestException('Invalid Password Reset OTP');

    const isExpired = isAfter(new Date(), userToken.expiry);
    if (isExpired) {
      await this.deleteOTPtoken(userToken.id);
      throw new BadRequestException('Invalid or expired Token');
    }

    return { token: userToken.token };
  }

  public async verifyOTP(input: IOTPInterface): Promise<{ token: string }> {
    const { token, email, subject: subject } = input;

    let userToken: Token | null =
      await this.tokenRepository.findByTokenEmailAndSubject(
        token,
        email || '',
        subject || TokenSubject.FORGOT_PASSWORD,
      );

    if (!userToken) {
      throw new BadRequestException('Invalid OTP');
    }

    const isExpired = isAfter(new Date(), userToken.expiry);

    if (isExpired) {
      await this.deleteOTPtoken(userToken.id);
      throw new BadRequestException('Invalid or expired Token');
    }

    await this.deleteOTPtoken(userToken.id);

    return userToken;
  }

  public async verifySignUpOTP(dto: IOTPInterface): Promise<{ token: string }> {
    const { token, email, phoneNo, subject: otpSubject } = dto;

    let userToken: Token | null = null;

    switch (otpSubject) {
      case TokenSubject.SIGN_UP_EMAIL:
        userToken = await this.tokenRepository.findByEmailToken(
          token,
          email || '',
        );
        break;
      case TokenSubject.SIGN_UP_PHONE:
        userToken = await this.tokenRepository.findByPhoneToken(
          token,
          phoneNo || '',
        );
        break;
      case TokenSubject.SIGN_UP_PHONE:
        userToken = await this.tokenRepository.findByPhoneToken(
          token,
          phoneNo || '',
        );
        break;
      default:
        throw new BadRequestException('Invalid OTP Subject');
    }

    if (!userToken) throw new BadRequestException('Invalid OTP');

    await this.deleteOTPtoken(userToken.id);

    return { token: userToken.token };
  }

  async generateOTPtoken(
    payload: CreateTokenDto,
  ): Promise<ITokenInterface & { token: string }> {
    let token = '';
    if (payload.phoneNo) {
      token =
        process.env.NODE_ENV === 'development'
          ? '123456'
          : randomstring.generate({
              length: 6,
              charset: 'numeric',
            });
    } else {
      token = randomstring.generate({
        length: 6,
        charset: 'numeric',
      });
    }

    const created = await this.tokenRepository.create({
      ...payload,
      token: token,
      tokenType: TokenType.OTP,
    });

    // Return with the actual token for SMS/Email sending
    return {
      ...created,
      token: token, // Include the actual token for SMS/Email
    };
  }

  async generateInviteToken(
    payload: CreateTokenDto,
  ): Promise<ITokenInterface & { token: string }> {
    const token = await this.jwtService.signAsync(
      {
        inviteeId: payload.inviteeId,
        email: payload.email,
        type: TokenSubject.ADMIN_INVITE,
      },
      {
        expiresIn: '3d',
      },
    );
    // console.log('Token: ', token);

    const hashedToken = await PasswordUtil.hashPassword(token);

    // console.log('Hashed Token: ', hashedToken);

    const created = await this.tokenRepository.create({
      ...payload,
      token: hashedToken,
      tokenType: TokenType.JWT,
    });

    // Return with the actual token for SMS/Email sending
    return {
      ...created,
      token: token, // Include the actual token for SMS/Email
    };
  }

  public async verifyInviteToken(input: IOTPInterface) {
    const {
      token,
      subject = TokenSubject.ADMIN_INVITE,
    } = input;

    // Verify JWT first
    const payload = await this.verifyJWTtoken(token);

    // Fetch stored hashed token
    const adminToken =
      await this.tokenRepository.findByEmailAndSubject(
        payload.email,
        subject,
      );

    if (!adminToken) {
      throw new BadRequestException(
        'Invalid invitation token',
      );
    }

    // Check expiry
    const isExpired = isAfter(
      new Date(),
      adminToken.expiry,
    );

    if (isExpired) {
      await this.deleteOTPtoken(adminToken.id);

      throw new BadRequestException(
        'Invitation token expired',
      );
    }

    // Verify raw JWT against stored hash
    const isValid =
      await PasswordUtil.verifyPassword(
        token,
        adminToken.token,
      );

    if (!isValid) {
      throw new BadRequestException(
        'Invalid invitation token',
      );
    }

    // Optional: single-use token
    await this.deleteOTPtoken(adminToken.id);

    return payload;
  }

  async generateJWTtoken<T extends object>(
    payload: T,
    options?: JwtSignOptions,
  ) {
    return await this.jwtService.signAsync(payload, options);
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
