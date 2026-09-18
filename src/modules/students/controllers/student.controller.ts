import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { StudentsService } from '../services/student.service';
import { GetStudentsQueryDto } from '../dto/student.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserType } from 'src/enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';

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
}
