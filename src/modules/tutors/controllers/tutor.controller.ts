import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards, 
  HttpCode,
  HttpStatus,
  Query,
  Patch,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TutorService } from '../services/tutor.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../auth/auth.interface';
import { UserType } from '../../../enums/user-type.enum';
import {
  CreateTutorDto,
  GetTutorsQueryDto,
  ChangeTutorPasswordDto,
  UpdateTutorProfileDto,
} from '../dto/tutor.dto';
import { ResponseUtil } from 'src/utils/response.utils';
import { Validators } from '../../../utils/validators.utils';

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

  @Roles(UserType.TUTOR)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get authenticated tutor profile',
  })
  @ApiResponse({
    status: 200,
    description:
      'Tutor profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Tutor account not found',
  })
  async getMyProfile(@Request() req: AuthenticatedRequest) {
    const tutorId = Validators.validateUuid(
      req.user.userId,
    );

    const data =
      await this.tutorService.getMyProfile(tutorId);

    return ResponseUtil.handleResponse(
      data,
      'Tutor profile retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Roles(UserType.TUTOR)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update authenticated tutor profile',
  })
  @ApiResponse({
    status: 200,
    description:
      'Tutor profile updated successfully',
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
    @Body() body: UpdateTutorProfileDto,
  ) {
    const tutorId = Validators.validateUuid(
      req.user.userId,
    );

    const data =
      await this.tutorService.updateMyProfile(
        tutorId,
        body,
      );

    return ResponseUtil.handleResponse(
      data,
      'Tutor profile updated successfully',
      HttpStatus.OK,
    );
  }

  @Roles(UserType.TUTOR)
  @Patch('profile/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change authenticated tutor password',
  })
  @ApiResponse({
    status: 200,
    description:
      'Tutor password changed successfully',
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
    @Body() body: ChangeTutorPasswordDto,
  ) {
    const tutorId = Validators.validateUuid(
      req.user.userId,
    );

    await this.tutorService.changeMyPassword(
      tutorId,
      body,
    );

    return ResponseUtil.handleResponse(
      null,
      'Tutor password changed successfully',
      HttpStatus.OK,
    );
  }
}