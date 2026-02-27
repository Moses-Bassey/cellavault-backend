import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PasscodeRepository } from '../repositories/passcode.repository';
import { PasswordUtil } from 'src/utils/password.util';
import { UserType } from 'src/enums/user-type.enum';
import {
  CreatePasscodeDto,
  VerifyPasscodeDto,
  ResetPasscodeDto,
  ChangePasscodeDto,
} from '../dto/passcode.dto';
import { Passcode } from '../entities/passcode.entity';
import { UserRepository } from '../../users/repositories/user.repository';
import { DriverRepository } from '../../drivers/repositories/driver.repository';
import { TokenService } from 'src/services/token/token.service';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { TokenSubject } from 'src/enums/token.enum';
import moment from 'moment';

@Injectable()
export class PasscodeService {
  constructor(
    private readonly passcodeRepository: PasscodeRepository,
    private readonly userRepository: UserRepository,
    private readonly driverRepository: DriverRepository,
    private readonly tokenService: TokenService,
    private readonly emailEventService: EmailEventService,
  ) {}

  async createPasscode(
    userId: string,
    userType: UserType,
    input: CreatePasscodeDto,
  ): Promise<Passcode> {
    const existingPasscode = await this.passcodeRepository.findByUserId(
      userId,
      userType,
    );

    if (existingPasscode) {
      throw new ConflictException(
        'Passcode already exists. Change passcode or reset code.',
      );
    }

    const hashedCode = await PasswordUtil.hashPassword(input.code);
    const passcode = await this.passcodeRepository.create({
      userId,
      userType,
      code: hashedCode,
    });

    // Update hasPasscode flag in user/driver entity
    if (userType === UserType.DRIVER) {
      // await this.driverRepository.update(userId, { hasPasscode: true });
    } else {
      await this.userRepository.update(userId, { hasPasscode: true });
    }

    return passcode;
  }

  async changePasscode(
    userId: string,
    userType: UserType,
    input: ChangePasscodeDto,
  ) {
    const existingPasscode = await this.passcodeRepository.findByUserId(
      userId,
      userType,
    );

    if (!existingPasscode) {
      throw new NotFoundException(
        'Passcode not found. Please create a passcode first.',
      );
    }

    const isValid = await PasswordUtil.verifyPassword(
      input.oldPasscode,
      existingPasscode.code,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid old passcode');
    }

    const hashedCode = await PasswordUtil.hashPassword(input.newPassCode);
    await this.passcodeRepository.update(userId, userType, {
      code: hashedCode,
    });

    // Ensure hasPasscode flag is set to true
    if (userType === UserType.DRIVER) {
      // await this.driverRepository.update(userId, { hasPasscode: true });
    } else {
      await this.userRepository.update(userId, { hasPasscode: true });
    }

    return null;
  }

  async getPasscode(
    userId: string,
    userType: UserType,
  ): Promise<Passcode | null> {
    return await this.passcodeRepository.findByUserId(userId, userType);
  }

  async verifyPasscode(
    userId: string,
    userType: UserType,
    input: VerifyPasscodeDto,
  ): Promise<boolean> {
    const passcode = await this.passcodeRepository.findByUserId(
      userId,
      userType,
    );

    if (!passcode) {
      throw new NotFoundException(
        'Passcode not found. Please set a passcode first.',
      );
    }

    const isValid = await PasswordUtil.verifyPassword(
      input.code,
      passcode.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid passcode');
    }

    return true;
  }

  async requestResetPasscode(
    userId: string,
    userType: UserType,
  ): Promise<null> {
    const passcode = await this.passcodeRepository.findByUserId(
      userId,
      userType,
    );

    if (!passcode) {
      throw new NotFoundException(
        'Passcode not found. Please create a passcode first.',
      );
    }

    let email;

    if (userType === UserType.DRIVER) {
      const driver = await this.driverRepository.findById(userId);
      if (!driver) {
        throw new NotFoundException('Driver not found');
      }
      email = driver.email;
    } else {
      const user = await this.userRepository.findById(userId);
      console.log(user);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      email = user.email;
    }

    const expiry: Date = moment().add(10, 'minutes').toDate();

    const otpToken = await this.tokenService.generateOTPtoken({
      email: email,
      expiry: expiry,
      subject: TokenSubject.RESET_PASSCODE,
    });

    await this.emailEventService.emitForgetPasswordEmail(email, otpToken.token);

    return null;
  }

  async resetPasscode(
    userId: string,
    userType: UserType,
    email: string,
    input: ResetPasscodeDto,
  ): Promise<Passcode> {
    if (input.newCode !== input.confirmCode) {
      throw new BadRequestException(
        'New passcode and confirm passcode do not match',
      );
    }

    const passcode = await this.passcodeRepository.findByUserId(
      userId,
      userType,
    );

    if (!passcode) {
      throw new NotFoundException(
        'Passcode not found. Please create a passcode first.',
      );
    }

    const tokenResult = await this.tokenService.verifyOTP({
      token: input.otp,
      subject: TokenSubject.RESET_PASSCODE,
      email: email,
    });

    if (!tokenResult) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedCode = await PasswordUtil.hashPassword(input.newCode);
    await this.passcodeRepository.update(userId, userType, {
      code: hashedCode,
    });

    const updatedPasscode = await this.passcodeRepository.findByUserId(
      userId,
      userType,
    );
    if (!updatedPasscode) {
      throw new NotFoundException('Passcode not found after reset.');
    }

    return updatedPasscode;
  }
}
