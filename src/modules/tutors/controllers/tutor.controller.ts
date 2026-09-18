import {
  Controller,
  Post,
  Body,
  Get,
  Req, 
  UseGuards, 
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TutorService } from '../services/tutor.service';
import { Tutor } from '../entities/tutor.entity';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { CreateTutorDto, GetTutorsQueryDto } from '../dto/tutor.dto';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Tutors')
@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('tutors')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a tutor' })
  @ApiResponse({
    status: 201,
    description: 'Tutor created successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to create tutor' })
  async createTutor(@Body() input: CreateTutorDto) {
    const data = await this.tutorService.createTutor(input);
    return ResponseUtil.handleResponse(
      data,
      'Tutor created successfully',
      HttpStatus.OK,
    );
  }

  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tutors' })
  @ApiResponse({
    status: 200,
    description: 'Tutors retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Tutors not found' })
  async getAllTutors(@Query() query: GetTutorsQueryDto) {
    const data = await this.tutorService.getAllTutors({
      search: query.search,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });

    return ResponseUtil.handleResponse(
      data,
      'Tutors retrieved successfully',
      HttpStatus.OK,
    );
  }
}
