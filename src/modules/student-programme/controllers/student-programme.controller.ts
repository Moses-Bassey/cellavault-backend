import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { StudentProgrammeService } from '../services/student-programme.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RegisterStudentProgrammeDto } from '../dto/student-programme.dto';
import { StudentProgrammeResponseDto } from '../dto/student-programme.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserType } from '../../../enums/user-type.enum';
import type{ Request as ExpressRequest } from 'express';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { ResponseUtil } from 'src/utils/response.utils';
import { Validators } from 'src/utils/validators.utils';

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
}
