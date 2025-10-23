import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isAfter } from 'date-fns';
import { Token } from './entities';
import { CreateCustomTokenDto, VerifyCustomTokenDto } from './dto/token.dto';
import { TokenRepository } from './repositories/token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: any) {
    const expiresIn =
      this.configService.get<string>('app.jwtTokenExpiry') || '1h';
    return await this.jwtService.signAsync(payload, { expiresIn: parseInt(expiresIn) });
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new BadRequestException('Unable To Verify Token');
    }
  }

  async generateCustomToken(dto: CreateCustomTokenDto): Promise<string> {
    const token = await this.generateToken({ isCustom: true });

    await this.tokenRepository.create({
      token,
      expiry: dto.expiry,
      subject: dto.subject,
      email: dto.email,
    });

    return token;
  }

  public async verifyCustomToken(dto: VerifyCustomTokenDto) {
    const { token } = dto;

    const userToken = await this.tokenRepository.findByToken(token);

    if (!userToken) return false;

    const isExpired = isAfter(new Date(), userToken.expiry);

    if (isExpired) {
      await this.tokenRepository.delete(userToken.id);
      return false;
    }

    await this.tokenRepository.delete(userToken.id);

    return { email: userToken.email };
  }

  private async delete(id: string) {
    await this.tokenRepository.delete(id);
  }
}
