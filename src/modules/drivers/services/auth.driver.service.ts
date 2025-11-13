import {
    BadRequestException,
    ConflictException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request as ExpressRequest, request } from 'express';
  import { UserLoginIdentityType, UserType } from '../../../enums/user-type.enum';
  import { EmailEventService } from 'src/services/mail/email-event.service';
  import { SmsEventService } from 'src/services/sms/sms-event.service';
  import { TOKEN_SUBJECT } from 'src/services/token/token.constants';
  import { TokenService } from 'src/services/token/token.service';
  import { PasswordUtil } from 'src/utils/password.util';
  import { JwtAuthPayload } from '../../auth/auth.interface';
  import {
    ChangePasswordDto,
    ForgotPasswordDto,
    LoginOtpDto,
    LoginDriverDto,
    ResetPasswordDto,
    SignupEmail,
    SignupPhone,
    CreateAccountDto,
    VerifyOtpDto,
  } from '../dto/auth.driver.dto';
  import { TokenSubject, TokenType } from 'src/enums/token.enum';
  import moment from 'moment';
  import { LoginType } from 'src/enums/login-type.enum';
  import { CountryService } from '../../countries/services/country.service';
  import { DriverRepository } from '../repositories/driver.repository';
  import { ClientDeviceService } from '../../client-devices/services/client-device.service';
  import { Driver } from '../entities/driver.entity';
import { IDriverLoginData } from '../../../shared/interfaces/auth.interface';
import { Validators } from 'src/utils/validators.utils';
import { Utils } from 'src/utils/utils';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';
  
  @Injectable()
  export class AuthDriverService {
    constructor(
      private readonly driverRepository: DriverRepository,
      private readonly tokenService: TokenService,
      private readonly emailEventService: EmailEventService,
      private readonly smsEventService: SmsEventService,
      private readonly countryService: CountryService,
      private readonly clientDeviceService: ClientDeviceService,
    ) {} 
  
    async signUpPhoneNo(input: SignupPhone){
      const { country, phoneNo } = input;

      const existingCountry = await this.countryService.findById(country)
      if (!existingCountry){
        throw new ConflictException('Country code not found!') 
      }

      const phone = Utils.normalizeCountryPhone(existingCountry.phoneCode, phoneNo, existingCountry.phoneLength)
      const existingUser= await this.driverRepository.findByPhone(phone);
  
      if(existingUser){
        throw new ConflictException('Driver with this phoneNo already exist');
      }
      
      const otpToken = await this.tokenService.generateOTPtoken({
        phoneNo: phone,
        expiry: moment().add(10, 'minutes').toDate(),
        subject: TokenSubject.SIGN_UP_PHONE,
      })
  
      // Send SMS with OTP
      await this.smsEventService.emitSignUpOtpSms(Utils.phoneSMSFormat(phone), otpToken.token);
      
      return {otpToken: otpToken.token};
    }
  
    async signUpEmail(input: SignupEmail){
      input.email = Validators.validateEmail(input.email)
      const existingUser= await this.driverRepository.findByEmail(input.email);
  
      if(existingUser){
        throw new ConflictException('Driver with this email already exist');
      }
      const expiryDate = moment().add(10, 'minutes').toDate();
      const otpToken = await this.tokenService.generateOTPtoken({
        email: input.email,
        expiry: expiryDate,
        subject: TokenSubject.SIGN_UP_EMAIL,
      })
  
      // Send forget password email
      await this.emailEventService.emitSignUpOtpEmail(input.email, otpToken.token, expiryDate.toISOString());    
  
      return null;
    }

    async verifyOtp(input: VerifyOtpDto) {

      const { token, subject, email, phoneNo, country } = input;

      let data;

      if (subject === TokenSubject.SIGN_UP_EMAIL){
  
        input.email = Validators.validateEmail(input.email);
        data = await this.tokenService.validateOtp({token, subject, email, phoneNo});
  
      } else {
        
        if (!country){
          throw new BadRequestException('Must provide a valid country!')
        }
  
        const existingCountry = await this.countryService.findById(country)
        if (!existingCountry){
          throw new ConflictException('Country code not found!') 
        }
  
        const phone = Utils.normalizeCountryPhone(existingCountry.phoneCode, phoneNo, existingCountry.phoneLength)
  
        data = await this.tokenService.validateOtp({
          token, subject, phoneNo: phone
        });
      } 
      
      if(!data){
        throw new BadRequestException('Invalid OTP');
      }
      
      return input;
    }
  
    // async verifyOtp(input: VerifyOtpDto) {
    //   const data = await this.tokenService.validateOtp(input);
      
    //   if(!data){
    //     throw new BadRequestException('Invalid OTP');
    //   }
      
    //   return data;
    // }
  
    async createAccount(input: CreateAccountDto){
      input.email = Validators.validateEmail(input.email)

      const country = await this.countryService.findById(input.country);
      if (!country) {
        throw new NotFoundException('Country not found');
      }

      const emailUser = await this.checkEmailExist(input.email);
      if(emailUser) {
        throw new ConflictException("User with email already exist")
      }

      const phone = Utils.normalizeCountryPhone(country.phoneCode, input.phoneNo, country.phoneLength)

      const verifyPhoneOtp = await this.tokenService.verifySignUpOTP({
        phoneNo: phone,
        token: input.otpPhone,
        subject: TokenSubject.SIGN_UP_PHONE,
      });

      if (!verifyPhoneOtp) {
        throw new BadRequestException('Invalid OTP');
      }

      const verifyEmailOtp = await this.tokenService.verifySignUpOTP({
        email: input.email,
        token: input.otpEmail,
        subject: TokenSubject.SIGN_UP_EMAIL,
      });

      if (!verifyEmailOtp) {
        throw new BadRequestException('Invalid OTP');
      }
      
      const password = await PasswordUtil.hashPassword(input.password)

      const user = await this.driverRepository.create({
        email: input.email,
        phoneNo: phone,
        fullName: input.fullName,
        password: password,
        countryId: country.id,
        userType: UserType.DRIVER,
        loginType: LoginType.NORMAL,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true,
        gender: input.gender,
        isDisabled: false,
        kycCompleted: KYC_COMPLETED.NOT_COMPLETED,
        isGuarantorCompleted: false,
      });

      const payload = {
        sub: user.id,
        userType: UserType.DRIVER,
        userId: user!.id,
        email: input.email
      };

      const token: string = await this.tokenService.generateJWTtoken(payload);

      // Send welcome email
      await this.emailEventService.emitWelcomeEmail(user.email, user.fullName);

      const data : IDriverLoginData = {
        userId: user.id,
        email: input.email, 
        userType: UserType.DRIVER, 
        id: user.id, 
        token: token,
        isGuarantorCompleted: user.isGuarantorCompleted,
        kycCompleted: user.kycCompleted,
      }

      return data;
    }
  
    async login(input: LoginDriverDto){
      const { identity, country } = input;

      const identityType = Utils.getLoginIdentityType(identity);
      let driver;

      if (identityType == UserLoginIdentityType.EMAIL){
        driver = await this.checkEmailExist(identity);
      } else {

        if(!country){
          throw new BadRequestException('Must select a valid phone county')
        }

        const existingCountry = await this.countryService.findById(country)
        if (!existingCountry){
          throw new NotFoundException('Country phone not found!')
        }

        const phone = Utils.normalizeCountryPhone(existingCountry?.phoneCode, identity, existingCountry.phoneLength)

        driver = await this.driverRepository.findByPhone(phone);
      }

      if (!driver) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      if(driver.loginType !== LoginType.NORMAL){
        throw new BadRequestException('login with email and password');
      }
      
      if (driver.isDisabled) {
        throw new NotFoundException('Your account is disabled, contact Admin');
      }

      if (!driver.isEmailVerified || !driver.isPhoneVerified){
        throw new UnauthorizedException('Your account is not verified');
      }

      const verifyPassword = await PasswordUtil.verifyPassword(
        input.password,
        driver.password,
      );

      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      //Detect if the user login with a new device using the x-client-device-toke provided in the request header
      const clientDeviceToken = request.headers['x-client-device-token'] as string;
      if (clientDeviceToken) {
        const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(driver.id, clientDeviceToken);
        if (!clientDevice) {
          //send new device email with otp here 
          const otpToken = await this.tokenService.generateOTPtoken({
            email: driver.email,
            expiry: moment().add(5, 'minutes').toDate(),
            subject: TokenSubject.NEW_DEVICE_LOGIN_OTP,
          });
          await this.emailEventService.emitNewDeviceLoginOtpEmail(driver.email, otpToken.token);
          throw new UnauthorizedException('Detected new device login');
        }
      }

      const payload : JwtAuthPayload = {
        sub: driver.id,
        userType: driver.userType,
        userId: driver.id,
        email: driver.email
      };

      const token: string = await this.tokenService.generateJWTtoken(payload);

      const { password, ...rest } = driver;

      const data: IDriverLoginData = { 
        id: driver.id,
        token, 
        userType: driver.userType,
        userId: driver.id,
        email: driver.email,
        kycCompleted: driver.kycCompleted,
        isGuarantorCompleted: driver.isGuarantorCompleted ? true : false
      };

      return data;
      
    }
  
    async loginOtp(input: LoginOtpDto) {
      const { identity, otp, password, deviceInfo, country } = input;

      let user: Driver | null = null;

      const identityType = Utils.getLoginIdentityType(identity);
      if (identityType == UserLoginIdentityType.EMAIL){
        user = await this.driverRepository.findByEmail(Validators.validateEmail(identity));
      } else {
        if(!country){
          throw new BadRequestException('Must select a valid phone county')
        }

        const existingCountry = await this.countryService.findById(country)
        if (!existingCountry){
          throw new NotFoundException('Country phone not found!')
        }

        const phone = Utils.normalizeCountryPhone(existingCountry?.phoneCode, identity, existingCountry.phoneLength)

        user = await this.driverRepository.findByPhone(phone);
      }

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if(user.loginType !== LoginType.NORMAL){
        throw new BadRequestException('Only normal login type is allowed to login with OTP');
      }

      if (!user.isActive) {
        throw new NotFoundException('Your account is disabled, contact Admin');
      }

      if (!user.isEmailVerified){
        throw new UnauthorizedException('Your email account is not verified');
      }

      if (!user.isPhoneVerified){
        throw new UnauthorizedException('Your phone no. is not verified');
      }

      const verifyOtp = await this.tokenService.verifyOTP({
        email: user.email,
        token: otp,
        subject: TokenSubject.NEW_DEVICE_LOGIN_OTP,
      });

      if (!verifyOtp) {
        throw new BadRequestException('Invalid OTP');
      }

      const verifyPassword = await PasswordUtil.verifyPassword(
        password,
        user.password,
      );

      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const payload = {
        sub: user.id,
        userType: UserType.USER,
        userId: user.id,
        email: user.email
      };

      const token: string = await this.tokenService.generateJWTtoken(payload);

      const loginTime = moment().format('MMMM Do YYYY, h:mm A');
      await this.emailEventService.emitNewLoginEmail(
        user.email,
        user.fullName,
        deviceInfo,
        loginTime,
      );

      return {
        email: user.email, 
        userType: UserType.USER, 
        id: user.id, 
        token: token
      };
    }
  
    async forgotPassword(input: ForgotPasswordDto) {
      input.email = input.email.toLowerCase()
      const user = await this.checkEmailExist(input.email);
  
      if (!user) {
        return null;
      }
  
      if (user.loginType !== LoginType.NORMAL) {
        throw new BadRequestException('Only normal login type is allowed to reset password');
      }
  
      const expiry: Date = moment().add(10, 'minutes').toDate();
  
      const otpToken = await this.tokenService.generateOTPtoken({
        email: input.email,
        expiry: expiry,
        subject: TokenSubject.FORGOT_PASSWORD,
      })
      await this.emailEventService.emitForgetPasswordEmail(user.email, otpToken.token);
  
      return null;
    }
  
    async resetPassword(input: ResetPasswordDto) {
      const { confirmPassword, password, email, token } = input;

      input.email = input.email.toLowerCase()
  
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
  
      const tokenResult = await this.tokenService.verifyOTP({
        token: token,
        subject: TokenSubject.FORGOT_PASSWORD,
        email: email,
      });
  
      if (!tokenResult) {
        throw new BadRequestException('Invalid or expired reset token');
      }
  
      const user = await this.checkEmailExist(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      if (user.loginType !== LoginType.NORMAL) {
        throw new BadRequestException('Only normal login type is allowed to reset password');
      }
  
      await this.driverRepository.update(
        user.id,
        {password: await PasswordUtil.hashPassword(password) },
      );
  
      return null;
    }
  
    async changePassword(input: ChangePasswordDto, authUser: JwtAuthPayload) {
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
  
      await this.driverRepository.update(user.id, { password: hashedPassword });
  
      const changedAt = moment().format('MMMM Do YYYY, h:mm A');
      await this.emailEventService.emitPasswordChangedEmail(
        user.email,
        user.fullName,
        changedAt,
      );
  
      return null;
    }

    ////////////////
    //            //
    //   HELPERS  //
    //            //
    ////////////////
    
    async checkEmailExist(email: string): Promise<Driver | null> {
      return await this.driverRepository.findByEmail(email);
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
  