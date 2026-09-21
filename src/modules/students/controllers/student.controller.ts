import {
  Controller,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import type { AuthenticatedRequest } from '../../auth/auth.interface';
import { StudentsService } from '../services/student.service';
import {
  GetStudentsQueryDto,
  ChangeStudentPasswordDto,
  UpdateStudentProfileDto,
} from '../dto/student.dto';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserType } from 'src/enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { Validators } from '../../../utils/validators.utils';


@ApiTags('Students')
@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Students not found' })
  async getAllStudents(@Query() query: GetStudentsQueryDto) {
    const data = await this.studentsService.getAllStudents({
      search: query.search,
      gender: query.gender,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });

    return ResponseUtil.handleResponse(
      data,
      'Students retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Roles(UserType.STUDENT)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get authenticated student profile',
  })
  @ApiResponse({
    status: 200,
    description:
      'Student profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student account not found',
  })
  async getMyProfile(@Request() req: AuthenticatedRequest) {
    const studentId = Validators.validateUuid(
      req.user.userId,
    );

    const data =
      await this.studentsService.getMyProfile(studentId);

    return ResponseUtil.handleResponse(
      data,
      'Student profile retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Roles(UserType.STUDENT)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update authenticated student profile',
  })
  @ApiResponse({
    status: 200,
    description:
      'Student profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid profile data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async updateMyProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateStudentProfileDto,
  ) {
    const studentId = Validators.validateUuid(
      req.user.userId,
    );

    const data =
      await this.studentsService.updateMyProfile(
        studentId,
        body,
      );

    return ResponseUtil.handleResponse(
      data,
      'Student profile updated successfully',
      HttpStatus.OK,
    );
  }

  @Roles(UserType.STUDENT)
  @Patch('profile/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change authenticated student password',
  })
  @ApiResponse({
    status: 200,
    description:
      'Student password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid password change request',
  })
  @ApiResponse({
    status: 401,
    description:
      'Current password is incorrect',
  })
  async changeMyPassword(
    @Request() req: AuthenticatedRequest,
    @Body() body: ChangeStudentPasswordDto,
  ) {
    const studentId = Validators.validateUuid(
      req.user.userId,
    );

    await this.studentsService.changeMyPassword(
      studentId,
      body,
    );

    return ResponseUtil.handleResponse(
      null,
      'Student password changed successfully',
      HttpStatus.OK,
    );
  }
}