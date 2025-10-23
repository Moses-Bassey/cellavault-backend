import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { add } from 'date-fns';
import { User } from '../users/entities';
import { UserType } from '../../enums/user-type.enum';
import { MailService } from 'src/services/mail/mail.service';
import { TOKEN_SUBJECT } from 'src/services/token/token.constants';
import { TokenService } from 'src/services/token/token.service';
import { PasswordUtil } from 'src/utils/password.util';
import { ResponseUtil } from 'src/utils/response.utils';
import { UserRepository } from '../users/repositories/user.repository';
import { JwtAuthPayload } from './auth.interface';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private mailService: MailService,
    private tokenService: TokenService,
  ) {}

  async login(input: LoginUserDto) {
    try {
      const user = await this.checkEmailExist(input.email);

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      if (!user.isActive) {
        throw new NotFoundException('Your account is disabled, contact Admin');
      }

      const verifyPassword = await PasswordUtil.verifyPassword(
        input.password,
        user.password,
      );

      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const payload = {
        sub: user.id,
        userType: user.userType,
        userId: user.id,
        email: user.email
      };

      const token: string = await this.tokenService.generateToken(payload);

      const { password, ...rest } = user;

      const data = { token, user: rest };

      return ResponseUtil.success(data, 'Login Successful', HttpStatus.OK);
    } catch (error: unknown) {
      console.error(error);
      return ResponseUtil.errorFromException(
        error,
        'An error occurred during login',
      );
    }
  }

  async forgotPassword(input: ForgotPasswordDto) {
    try {
      const user = await this.checkEmailExist(input.email);

      if (!user) {
        return ResponseUtil.success(
          {},
          'Reset OTP has been sent to your email',
          200,
        );
      }

      const expiry: Date = add(new Date(), { minutes: 10 });

      const token: string = await this.tokenService.generateCustomToken({
        expiry,
        subject: TOKEN_SUBJECT.RESET_PASSWORD,
        email: user.email,
      });

      const resetLink: string = `${process.env.PEPP_APP_CLIENT_URL}/reset-password?token=${token}`;

      // Send forget password email
      await this.mailService.sendForgetPasswordEmail(user.email, resetLink);

      return ResponseUtil.success(
        {},
        'Reset link has been sent to your email',
        200,
      );
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred during password reset',
      );
    }
  }

  async resetPassword(input: ResetPasswordDto) {
    const { confirmPassword, password } = input;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const tokenResult = await this.tokenService.verifyCustomToken({
      token: input.token,
    });

    if (!tokenResult) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.userRepository.update(
      tokenResult.email,
      { password: await PasswordUtil.hashPassword(password) },
    );

    return ResponseUtil.success({}, 'Password reset successful', 200);
  }

  async changePassword(input: ChangePasswordDto, authUser: JwtAuthPayload) {
    try {
      const user = await this.checkEmailExist(authUser.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { confirmPassword, newPassword, oldPassword } = input;

      const verifyOldPass = await PasswordUtil.verifyPassword(
        oldPassword,
        user.password,
      );

      if (!verifyOldPass) {
        throw new BadRequestException('Incorrect Old Password');
      }

      if (confirmPassword !== newPassword) {
        throw new BadRequestException('Password do not match');
      }

      const hashedPassword = await PasswordUtil.hashPassword(newPassword);

      await this.userRepository.update(user.id, { password: hashedPassword });

      return ResponseUtil.success({}, 'Password Changed', 200);
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(error);
    }
  }
  ////////////////
  //            //
  //   HELPERS  //
  //            //
  ////////////////
  async checkEmailExist(email: string): Promise<User | null> {
    return await this.userRepository.findWithCountry(email, UserType.USER);
  }

  private getBaseUrlFromRequest(req: ExpressRequest): string {
    const origin = req.get('origin') || req.get('referer');

    if (origin) {
      const url = new URL(origin);
      return `${url.protocol}//${url.host}`;
    }

    return process.env.PEPP_APP_CLIENT_URL || 'https://apps.peppcruise.com';
  }
}
