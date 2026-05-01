import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import moment from 'moment';
import { JwtSignOptions } from '@nestjs/jwt';
import { TokenService } from 'src/services/token/token.service';
import { TokenSubject } from 'src/enums/token.enum';
import { Request as ExpressRequest, request } from 'express';
import { AdminRepository } from '../admins/repositories/admin.repository';
import { Admin } from '../admins/entities/admin.entity';
import { ClientDeviceService } from '../client-devices/services/client-device.service';
import { ClientDeviceEventEmitter } from '../client-devices/emitters/client-device.emitter';
import { IAdminLoginData } from '../../shared/interfaces/auth.interface';
import { UserType } from '../../enums/user-type.enum';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { PasswordUtil } from '../../utils/password.util';
import { CreateAdminDto, AdminLoginDto, LoginOtpDto } from './dto/auth.dto';
import { Validators } from '../../utils/validators.utils';
import { JwtAuthPayload } from './auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly clientDeviceService: ClientDeviceService,
    private readonly emailEventService: EmailEventService,
    private readonly tokenService: TokenService,
    private readonly clientDeviceEventEmitter: ClientDeviceEventEmitter,
  ) {}

  // async create(data: CreateAdminDto): Promise<Admin> {
  //   data.email = Validators.validateEmail(data.email);

  //   const emailUser = await this.checkEmailExist(data.email);
  //   if (emailUser) {
  //     throw new ConflictException('Admin with email already exists');
  //   }

  //   const hashedPassword = await PasswordUtil.hashPassword(data.password);

  //   const admin = await this.adminRepository.create({
  //     fullName: data.fullName,
  //     email: data.email,
  //     password: hashedPassword,
  //     role: UserType.PEPP_ADMIN,
  //   });
  //   return admin;
  // }

  async login(
    data: AdminLoginDto,
    request: Request, // inject request properly
  ): Promise<IAdminLoginData> {
    const { email, password, rememberMe } = data;

    // Find admin
    const admin = await this.checkEmailExist(email);
    if (!admin) {
      throw new NotFoundException('Account not found');
    }

    // Check account status
    if (!admin.isVerified || !admin.isActive) {
      throw new UnauthorizedException(
        'Account creation request not approved, please contact support team.',
      );
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.verifyPassword(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate device (if token is provided)
    const clientDeviceToken = request.headers['x-client-device-token'] as
      | string
      | undefined;

    // console.log('clientDeviceToken:', clientDeviceToken);

    if (clientDeviceToken) {
      await this.validateClientDevice(admin, clientDeviceToken);
    }

    // Generate JWT & response
    return this.createAuthPayload(admin, rememberMe);
  }

  async loginOtp(input: LoginOtpDto, request: Request) {
    const { email, otp, password, rememberMe, deviceInfo } = input;

    const admin = await this.checkEmailExist(email);
    if (!admin) throw new NotFoundException('Account not found');

    const verifyOtp = await this.tokenService.verifyOTP({
      email: admin.email,
      token: otp,
      subject: TokenSubject.NEW_DEVICE_LOGIN_OTP,
    });

    if (!verifyOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    const verifyPassword = await PasswordUtil.verifyPassword(
      password,
      admin.password,
    );

    if (!verifyPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const loginResponse = await this.createAuthPayload(admin, rememberMe);

    const loginTime = moment().format('MMMM Do YYYY, h:mm A');

    // Emit email event
    this.emailEventService.emitNewLoginEmail(
      admin.email,
      admin.fullName,
      deviceInfo.name || 'Unknown Device',
      loginTime,
    );

    const ipAddress = this.getClientIp(request);

    // Emit client device event asynchronously
    this.clientDeviceEventEmitter.emitAddDeviceToken({
      adminId: admin.id,
      ipAddress: ipAddress ?? 'Unknown IP',
      deviceFCMToken: deviceInfo.deviceFCMToken || null,
      name: deviceInfo.name || null,
      userType: admin.role,
    });

    return loginResponse;
  }

  // async deleteAdminAccount(email: string, password: string): Promise<null> {
  //   const admin = await this.adminRepository.findByEmail(email);
  //   if (!admin) throw new NotFoundException('Admin not found');

  //   const verifyPassword = await PasswordUtil.verifyPassword(
  //     password,
  //     admin.password,
  //   );
  //   if (!verifyPassword) throw new UnauthorizedException('Invalid credentials');

  //   const newEmail = `${admin.email}-${admin.id}`;
  //   const updatedAdmin = await this.adminRepository.update(admin.id, {
  //     email: newEmail,
  //   });
  //   if (!updatedAdmin)
  //     throw new NotFoundException('Admin not found after deletion');

  //   const deletedCount = await this.adminRepository.delete(admin.id);
  //   if (deletedCount == 0) {
  //     this.logger.warn(`Admin id=${admin.id} not deleted`);
  //     throw new BadRequestException('Failed to delete');
  //   }
  //   this.logger.log(`Admin id=${admin.id} deleted`);
  //   return null;
  // }

  async checkEmailExist(email: string): Promise<Admin | null> {
    return await this.adminRepository.findByEmail(email);
  }

  // helpers
  private async validateClientDevice(
    admin: Admin,
    clientDeviceToken: string,
  ): Promise<void> {
    const clientDevice =
      await this.clientDeviceService.findByUserIdAndDeviceToken(
        admin.id,
        clientDeviceToken,
      );

    console.log('Client device: ', clientDevice, 'Id: ', admin.id);
    if (clientDevice) return;

    const otpToken = await this.tokenService.generateOTPtoken({
      email: admin.email,
      expiry: moment().add(5, 'minutes').toDate(),
      subject: TokenSubject.NEW_DEVICE_LOGIN_OTP,
    });

    await this.emailEventService.emitNewDeviceLoginOtpEmail(
      admin.email,
      otpToken.token,
    );

    throw new UnauthorizedException('Detected new device login');
  }

  private async createAuthPayload(
    admin: Admin,
    rememberMe: boolean,
  ): Promise<IAdminLoginData> {
    const tokenOptions: JwtSignOptions = rememberMe ? { expiresIn: '7d' } : {};

    const payload: JwtAuthPayload = {
      sub: admin.id,
      userId: admin.id,
      email: admin.email,
      userType: admin.role, // TODO: remove later
    };

    const token = await this.tokenService.generateJWTtoken(
      payload,
      tokenOptions,
    );

    return {
      token,
      user: {
        id: admin.id,
        role: admin.role,
        email: admin.email,
      }
    };
  }

  /**
   * Safely extract the client IP address from a request
   * @param request Express Request object
   * @returns client IP as string or undefined
   */
  private getClientIp(request: Request): string | undefined {
    const forwarded = request.headers['x-forwarded-for'];
    let ipAddress: string | undefined;

    // Handle x-forwarded-for header (might be string or array)
    if (forwarded) {
      ipAddress = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0].trim();
    }

    // Fallback to socket remote address
    if (!ipAddress && 'socket' in request && request.socket) {
      ipAddress = (request.socket as any).remoteAddress ?? undefined;
    }

    // Normalize IPv6 addresses
    if (ipAddress?.startsWith('::ffff:')) {
      ipAddress = ipAddress.replace('::ffff:', '');
    }

    return ipAddress;
  }
}
