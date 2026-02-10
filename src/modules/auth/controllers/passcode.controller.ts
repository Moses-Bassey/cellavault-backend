import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PasscodeService } from '../services/passcode.service';
import {
  CreatePasscodeDto,
  VerifyPasscodeDto,
  ResetPasscodeDto,
  ChangePasscodeDto,
} from '../dto/passcode.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ResponseUtil } from 'src/utils/response.utils';
import { JwtAuthPayload } from '../auth.interface';
import { Validators } from 'src/utils/validators.utils';

@ApiTags('Passcode')
@Controller('auth/passcode')
@Auth()
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class PasscodeController {
  constructor(private readonly passcodeService: PasscodeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create passcode' })
  @ApiResponse({ status: 201, description: 'Passcode created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Passcode already exists',
  })
  async createPasscode(
    @Body() input: CreatePasscodeDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.passcodeService.createPasscode(
      userId,
      req.user.userType,
      input,
    );
    return ResponseUtil.handleResponse(
      {},
      'Passcode created successfully',
      HttpStatus.CREATED,
    );
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update passcode' })
  @ApiResponse({ status: 200, description: 'Passcode updated successfully' })
  @ApiResponse({ status: 404, description: 'Passcode not found' })
  async changePasscode(
    @Body() input: ChangePasscodeDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.passcodeService.changePasscode(
      Validators.validateUuid(req.user.userId),
      req.user.userType,
      input,
    );
    return ResponseUtil.handleResponse(
      {},
      'Passcode updated successfully',
      HttpStatus.OK,
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify passcode' })
  @ApiResponse({ status: 200, description: 'Passcode verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid passcode' })
  async verifyPasscode(
    @Body() input: VerifyPasscodeDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const data = await this.passcodeService.verifyPasscode(
      req.user.userId,
      req.user.userType,
      input,
    );
    return ResponseUtil.handleResponse(
      { verified: true },
      'Passcode verified successfully',
      HttpStatus.OK,
    );
  }

  @Post('reset-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request passcode reset OTP' })
  @ApiResponse({
    status: 200,
    description: 'Reset OTP has been sent to your email',
  })
  @ApiResponse({ status: 404, description: 'Passcode not found' })
  async requestResetPasscode(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    await this.passcodeService.requestResetPasscode(userId, req.user.userType);
    return ResponseUtil.handleResponse(
      {},
      'Reset OTP has been sent to your email',
      HttpStatus.OK,
    );
  }

  @Patch('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset passcode with OTP' })
  @ApiResponse({ status: 200, description: 'Passcode reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 404, description: 'Passcode not found' })
  async resetPasscode(
    @Body() input: ResetPasscodeDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    await this.passcodeService.resetPasscode(
      userId,
      req.user.userType,
      req.user.email,
      input,
    );
    return ResponseUtil.handleResponse(
      {},
      'Passcode reset successfully',
      HttpStatus.OK,
    );
  }
}
