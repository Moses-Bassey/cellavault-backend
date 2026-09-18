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
import { StudentsService } from 'src/modules/students/services/student.service';
import { Admin } from '../admins/entities/admin.entity';
import { Student } from '../students/entities/student.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { ILoginData } from '../../shared/interfaces/auth.interface';
import { ICreateStudentInput } from '../students/interfaces/student.interface'
import { UserType } from '../../enums/user-type.enum';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { PasswordUtil } from '../../utils/password.util';
import { Utils } from 'src/utils/utils';
import { InviteAdminDto, LoginDto, LoginOtpDto, CompleteAdminOnboardingDto } from './dto/auth.dto';
import { CreateStudentDto, StudentResponseDto } from '../students/dto/student.dto';
import { Validators } from '../../utils/validators.utils';
import { JwtAuthPayload } from './auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly studentRepository: StudentRepository,
    private readonly tutorRepository: TutorRepository,
    private readonly studentsService: StudentsService,
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

  /**
   * Public registration endpoint for students.
   * Returns created student (without password) and triggers email event if temporary password was generated.
   */
  async registerStudent(dto: CreateStudentDto) {
    const input: ICreateStudentInput = {
      name: dto.name,
      email: dto.email,
      phone: dto.phone ? Utils.normalizeCountryPhone('+234', dto.phone, 13) : null,
      guardianPhoneOrEmail: dto.guardianPhoneOrEmail ?? null,
      password: dto.password, // may be undefined -> service will generate
      gender: dto.gender ?? null,
    };

    const student = await this.studentsService.createStudent(input);

  
    // Use centralized email event service to emit event (listener will send the email)
    await this.emailEventService.emitWelcomeEmail(
      student.email,
      student.name,
      `${process.env.APP_STUDENT_WEB_URL ?? 'https://nugiinnovations.com'}/login`,
    );

    return student;
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

