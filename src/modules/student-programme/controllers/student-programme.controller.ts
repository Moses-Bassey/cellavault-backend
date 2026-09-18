import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Param, Get, Query } from '@nestjs/common';
import { StudentProgrammeService } from '../services/student-programme.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  RegisterStudentProgrammeDto,
  GetStudentProgrammesQueryDto,
  StudentProgrammeResponseDto,
} from '../dto/student-programme.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserType } from '../../../enums/user-type.enum';
import type{ Request as ExpressRequest } from 'express';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { ResponseUtil } from 'src/utils/response.utils';
import { Validators } from 'src/utils/validators.utils';
import { UuidValidationPipe } from 'src/shared/pipes/uuid.validator.pipe';

@ApiTags('StudentProgramme')
@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('student-programmes')
export class StudentProgrammeController {
  constructor(private readonly studentProgrammeService: StudentProgrammeService) {}

  @Roles(UserType.STUDENT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a student into a programme' })
  @ApiBody({ type: RegisterStudentProgrammeDto })
  @ApiResponse({ status: 201, description: 'Student registered successfully', type: StudentProgrammeResponseDto })
  @ApiResponse({ status: 409, description: 'Student already enrolled in this programme' })
  async register(
    @Request() req: ExpressRequest & { user:  JwtAuthPayload },
    @Body() dto: RegisterStudentProgrammeDto,
  ) {
    const userId = Validators.validateUuidV4(req.user.userId)
    const data = await this.studentProgrammeService.registerStudentProgramme({
      studentId: userId,
      programmeId: dto.programmeId
    });

    return ResponseUtil.handleResponse(
      data,
      'Student registered successfully',
      HttpStatus.CREATED,
    );
  }

  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all student programmes' })
  @ApiResponse({ status: 200, description: 'Student programmes retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student programmes not found' })
  async getAllStudentProgrammes(@Query() query: GetStudentProgrammesQueryDto) {
    const data = await this.studentProgrammeService.getAllStudentProgrammes({
      search: query.search,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });

    return ResponseUtil.handleResponse(
      data,
      'Student programmes retrieved successfully',
      HttpStatus.OK,
    );
  }

  // Get enrolments for student from bearer token
  @Roles(UserType.STUDENT)
  @Get('my-programmes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all enrolments for the authenticated student' })
  @ApiResponse({ status: 200, description: 'Enrolments retrieved successfully' })
  async getMyEnrolments(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
    @Query() query: GetStudentProgrammesQueryDto,
  ) {
    const studentId = Validators.validateUuidV4(req.user.userId);
    const data = await this.studentProgrammeService.getAllEnrolmentsForStudent(studentId, {
      search: query.search,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });

    return ResponseUtil.handleResponse(
      data,
      'Enrolments retrieved successfully',
      HttpStatus.OK,
    );
  }

  // Get enrolments for student from URL param
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Get(':studentId/programmes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all enrolments for a specific student by ID' })
  @ApiResponse({ status: 200, description: 'Enrolments retrieved successfully' })
  async getEnrolmentsByStudentId(
    @Param('studentId', UuidValidationPipe) studentId: string,
    @Query() query: GetStudentProgrammesQueryDto,
  ) {
    const validatedId = Validators.validateUuidV4(studentId);
    const data = await this.studentProgrammeService.getAllEnrolmentsForStudent(validatedId, {
      search: query.search,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });

    return ResponseUtil.handleResponse(
      data,
      'Enrolments retrieved successfully',
      HttpStatus.OK,
    );
  }
}
