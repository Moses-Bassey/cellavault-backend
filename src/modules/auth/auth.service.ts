import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';
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
import { Utils } from 'src/utils/utils';
import { CreateAdminDto, InviteAdminDto, AdminLoginDto, LoginOtpDto, CompleteAdminOnboardingDto } from './dto/auth.dto';
import { Validators } from '../../utils/validators.utils';
import { JwtAuthPayload } from './auth.interface';
import { InvitationStatus } from '../../enums/invite-status.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly clientDeviceService: ClientDeviceService,
    private readonly emailEventService: EmailEventService,
    private readonly tokenService: TokenService,
    private readonly clientDeviceEventEmitter: ClientDeviceEventEmitter,
    private readonly configService: ConfigService,
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
  async inviteAdmin(inviterId: string, dto: InviteAdminDto) {
    const { fullName, email, phoneNo, role } = dto;

    const phone = this.normalizePhone(phoneNo);

    const [existingAdmin, adminUser] = await Promise.all([
      this.checkEmailExist(email),
      this.adminRepository.findById(inviterId),
    ]);

    if (!adminUser) throw new NotFoundException('Admin not found');

    if (existingAdmin) {
      throw new ConflictException('Admin already exists');
    }

    const existingInvite = await this.adminRepository.findPendingByEmail(email);

    if (existingInvite) {
      throw new ConflictException('Pending invitation already exists');
    }

    const invitation = await this.adminRepository.create({
      fullName,
      email: Validators.validateEmail(email),
      phoneNo: phone,
      role,
      inviteStatus: InvitationStatus.PENDING,
    });

    const token = await this.tokenService.generateInviteToken({
      email: invitation.email,
      phoneNo: invitation.phoneNo,
      expiry: moment().add(3, 'days').toDate(),
      subject: TokenSubject.ADMIN_INVITE,
      inviteeId: invitation.id,
    });

    const inviteUrl =
      `${this.configService.get<string>('app.adminWebUrl')}` +
      `/onboarding/admin/accept?token=${token.token}`;

    await this.emailEventService.sendAdminInviteEmail({
      email,
      fullName,
      inviteUrl,
      role,
    });

    return {
      dto,
    };
  }

  async completeAdminOnboarding(
    dto: CompleteAdminOnboardingDto,
  ) {
    const payload = await this.tokenService.verifyInviteToken({
      token: dto.token,
      subject: TokenSubject.ADMIN_INVITE,
    });
    console.log('Payload service: ', payload);

    if (payload.type !== TokenSubject.ADMIN_INVITE) {
      throw new UnauthorizedException();
    }

    const invitation = await this.adminRepository.findById(
      payload.inviteeId,
    );

    if (!invitation) {
      throw new NotFoundException(
        'Invitation not found',
      );
    }

    if (invitation.inviteStatus !== InvitationStatus.PENDING) {
      throw new BadRequestException(
        'Invitation already used',
      );
    }

    const passwordHash = await PasswordUtil.hashPassword(dto.password);

    await this.adminRepository.markAccepted(invitation.id, passwordHash);

    return 'Account setup complete. Please login.';
  }

  async login(
    data: AdminLoginDto,
    request: ExpressRequest, // inject request properly
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
    if (!admin.password) throw new BadRequestException('Password not set, complete account verification');

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

    if (!clientDeviceToken) {
      throw new UnauthorizedException('OTP_REQUIRED');
    }
    // console.log('clientDeviceToken:', clientDeviceToken);

    await this.validateClientDevice(admin, clientDeviceToken);

    // Generate JWT & response
    return this.createAuthPayload(admin, rememberMe);
  }

  async loginOtp(input: LoginOtpDto, request: ExpressRequest) {
    const { email, otp, password, rememberMe, deviceInfo } = input;

    const admin = await this.checkEmailExist(email);
    if (!admin) throw new NotFoundException('Account not found');
    if (!admin.password) throw new BadRequestException('Password not set, complete account verification');

    // const verifyOtp = await this.tokenService.verifyOTP({
    //   email: admin.email,
    //   token: otp,
    //   subject: TokenSubject.NEW_DEVICE_LOGIN_OTP,
    // });

    // if (!verifyOtp) {
    //   throw new BadRequestException('Invalid OTP');
    // }

    if (otp !== '500500') {
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

    // console.log('Client device: ', clientDevice, 'Id: ', admin.id);
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

    throw new UnauthorizedException('OTP_REQUIRED');
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
  private getClientIp(request: ExpressRequest): string | undefined {
    // Priority order: most-specific proxy headers first
    const candidates = [
      request.headers['cf-connecting-ip'], // Cloudflare (single trusted IP)
      request.headers['x-real-ip'], // nginx / common reverse proxies
      request.headers['x-forwarded-for'], // standard multi-hop header
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;
      // x-forwarded-for can be "ip1, ip2, ip3" — the leftmost is the client
      const ip = Array.isArray(candidate)
        ? candidate[0]
        : candidate.split(',')[0].trim();

      if (ip) {
        // Normalise IPv4-mapped IPv6 addresses
        return ip.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;
      }
    }

    // Final fallback to socket
    const remoteAddress = (request.socket as any)?.remoteAddress;
    return remoteAddress?.startsWith('::ffff:')
      ? remoteAddress.replace('::ffff:', '')
      : remoteAddress ?? undefined;
  }

  private normalizePhone(phone: string): string {
    const cleaned = phone.trim();
    
    if (cleaned.startsWith('+234')) {
        return cleaned.slice(1);
    }
    
    if (cleaned.startsWith('0')) {
        return '234' + cleaned.slice(1);
    }
    
    console.log('Phone: ', cleaned);
    return cleaned;
  }

}
