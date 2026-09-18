import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthPayload } from '../auth.interface';
import { CreateAdminDto, InviteAdminDto, CompleteAdminOnboardingDto, LoginDto, LoginOtpDto } from '../dto/auth.dto';
import { CreateStudentDto } from '../../students/dto/student.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { AuthService } from '../auth.service';
import { ResponseUtil } from 'src/utils/response.utils';
import { Validators } from 'src/utils/validators.utils';

@ApiTags('Auth')
@Controller('auth/student')
export class StudentAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginDto) {
    const data = await this.authService.loginStudent(input);
    return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new student (public)' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Student created'})
  @ApiResponse({ status: 409, description: 'Student with this email already exists' })
  async registerStudent(@Body() dto: CreateStudentDto) {
    const data = await this.authService.registerStudent(dto);
    return ResponseUtil.handleResponse(data, 'Student account created successfully', HttpStatus.CREATED);
  }

}
