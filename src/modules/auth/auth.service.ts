import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { TokenService } from 'src/services/token/token.service';
import { TokenSubject } from 'src/enums/token.enum';
import { Request as ExpressRequest, request } from 'express';
import { AdminRepository } from '../admins/repositories/admin.repository';
import { StudentRepository } from '../students/repositories/student.repository';
import { TutorRepository } from '../tutors/repositories/tutor.repository';
import { Admin } from '../admins/entities/admin.entity';
import { Student } from '../students/entities/student.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { ILoginData } from '../../shared/interfaces/auth.interface';
import { UserType } from '../../enums/user-type.enum';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { PasswordUtil } from '../../utils/password.util';
import { Utils } from 'src/utils/utils';
import { InviteAdminDto, LoginDto, LoginOtpDto, CompleteAdminOnboardingDto } from './dto/auth.dto';
import { Validators } from '../../utils/validators.utils';
import { JwtAuthPayload } from './auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly studentRepository: StudentRepository,
    private readonly tutorRepository: TutorRepository,
    private readonly emailEventService: EmailEventService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async login(data: LoginDto): Promise<ILoginData> {
    return this.handleLogin(data, UserType.ADMIN);
  }

  async loginStudent(data: LoginDto): Promise<ILoginData> {
    return this.handleLogin(data, UserType.STUDENT);
  }

  async loginTutor(data: LoginDto): Promise<ILoginData> {
    return this.handleLogin(data, UserType.TUTOR);
  }

  /**
   * Reusable login handler for all user types
   */
  private async handleLogin(
    data: LoginDto,
    userType: UserType,
  ): Promise<ILoginData> {
    const { email, password, rememberMe } = data;

    // Find user
    const user = await this.checkEmailExist(email, userType);
    if (!user) {
      throw new NotFoundException(`${userType} account not found`);
    }

    // Check account status
    if (!user.isActive) {
      throw new UnauthorizedException(
        `${userType} account is inactive, please contact support team.`,
      );
    }
    if (!user.password) {
      throw new BadRequestException('Password not set, complete account verification');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT & response
    return this.createAuthPayload(user, rememberMe);
  }

  async checkEmailExist(
    email: string,
    userType: UserType,
  ): Promise<Admin | Student | Tutor | null> {
    switch (userType) {
      case UserType.SUPER_ADMIN:
      case UserType.ADMIN:
        return await this.adminRepository.findByEmail(email);

      case UserType.STUDENT:
        return await this.studentRepository.findByEmail(email);

      case UserType.TUTOR:
        return await this.tutorRepository.findByEmail(email);

      default:
        throw new BadRequestException(`Unsupported user type: ${userType}`);
    }
  }



  private async createAuthPayload(
    user: Admin | Student | Tutor,
    rememberMe: boolean,
  ): Promise<ILoginData> {
    const tokenOptions: JwtSignOptions = rememberMe ? { expiresIn: '7d' } : {};

    const payload: JwtAuthPayload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      userType: user.role,
    };

    const token = await this.tokenService.generateJWTtoken(payload, tokenOptions);

    this.eventEmitter.emit('newLoginEvent', user.id);
    return {
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };
  }
}

