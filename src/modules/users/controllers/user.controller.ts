import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
// import type { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
// import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
// import { JwtAuthPayload } from '../../auth/auth.interface';
// import { Validators } from 'src/utils/validators.utils';
// import { DashboardDto, UpdateImageUrlDto } from '../dto/user.dto';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';
import { TripStatus } from '../../trips/entities/trip.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Account screen
  @Get(':userId')
  @ApiOperation({ summary: 'Get User account' })
  @ApiResponse({ status: 200, description: 'User fetchced successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getPassenger(@Param('userId', UuidValidationPipe) passengerId: string) {
    const data = await this.userService.getPassengerAccount(passengerId);
    return ResponseUtil.handleResponse(
      data,
      'User details retrieved',
      HttpStatus.OK,
    );
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({
    status: 200,
    description: 'User details updated successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updatePassenger(
    @Param('userId') passengerId: string,
    @Body()
    body: {
      fullName?: string;
      email?: string;
      phoneNo?: string;
      imageUrl?: string;
      shortDescription?: string;
    },
  ) {
    const data = await this.userService.updatePassengerAccount(
      passengerId,
      body,
    );
    return ResponseUtil.handleResponse(
      data,
      'User details updated',
      HttpStatus.OK,
    );
  }

  @Post(':userId/suspend')
  @ApiOperation({ summary: 'Suspend user account' })
  @ApiResponse({ status: 200, description: 'User account suspended' })
  @ApiResponse({ status: 400, description: 'Failed to suspend user account' })
  @HttpCode(HttpStatus.OK)
  async suspendPassenger(
    @Param('userId', UuidValidationPipe) passengerId: string,
    @Body() body: { reason?: string },
  ) {
    const data = await this.userService.suspendPassenger(passengerId, body);
    return ResponseUtil.handleResponse(
      data,
      'User account suspended',
      HttpStatus.OK,
    );
  }

  @Post(':userId/unsuspend')
  @ApiOperation({ summary: 'Enable user account' })
  @ApiResponse({ status: 200, description: 'User account enabled' })
  @ApiResponse({ status: 400, description: 'Failed to enable user account' })
  @HttpCode(HttpStatus.OK)
  async unsuspendPassenger(
    @Param('userId', UuidValidationPipe) passengerId: string,
  ) {
    const data = await this.userService.unsuspendPassenger(passengerId);
    return ResponseUtil.handleResponse(
      data,
      'User account enabled',
      HttpStatus.OK,
    );
  }

  // Activity screen
  @Get(':userId/activity/summary')
  @ApiOperation({ summary: "Fetch user's ride activity" })
  @ApiResponse({
    status: 200,
    description: "User's ride activity retrieved successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Failed to retrieve user's ride activity",
  })
  @ApiResponse({ status: 404, description: "User's ride activity not found" })
  async getActivitySummary(
    @Param('userId', UuidValidationPipe) passengerId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const data = await this.userService.getPassengerActivitySummary({
      passengerId,
      from,
      to,
    });
    return ResponseUtil.handleResponse(
      data,
      "User's ride activity retrieved successfully",
      HttpStatus.OK,
    );
  }

  @Get(':userId/activity/rides')
  @ApiOperation({ summary: "Fetch user's ride history" })
  @ApiResponse({
    status: 200,
    description: "User's ride history retrieved successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Failed to retrieve user's ride history",
  })
  @ApiResponse({ status: 404, description: "User's ride history not found" })
  async listRides(
    @Param('userId', UuidValidationPipe) passengerId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: TripStatus,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const data = await this.userService.listPassengerRides({
      passengerId,
      from,
      to,
      status,
      limit: limit ? Number(limit) : undefined,
      cursor,
    });
    return ResponseUtil.handleResponse(
      data,
      "User's ride history retrieved successfully",
      HttpStatus.OK,
    );
  }

  @Get(':userId/activity/rides/:rideId')
  @ApiOperation({ summary: 'Fetch ride details' })
  @ApiResponse({
    status: 200,
    description: 'Ride details retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: "Failed to retrieve ride's details",
  })
  @ApiResponse({ status: 404, description: 'Ride details not found' })
  async getRideDetails(
    @Param('userId', UuidValidationPipe) passengerId: string,
    @Param('rideId', UuidValidationPipe) rideId: string,
  ) {
    const data = await this.userService.getRideDetails(passengerId, rideId);
    return ResponseUtil.handleResponse(
      data,
      'Ride details retrieved successfully',
      HttpStatus.OK,
    );
  }

  // @Put('profile-image')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Update user image URL' })
  // @ApiResponse({ status: 200, description: 'Image URL updated successfully' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // async updateImageUrl(
  //   @Request() req: ExpressRequest & { user: JwtAuthPayload },
  //   @Body() updateImageUrlDto: UpdateImageUrlDto,
  // ) {
  //   const userId = Validators.validateUuid(req.user.userId);
  //   const data = await this.userService.updateImageUrl(
  //     userId,
  //     updateImageUrlDto.imageUrl,
  //   );
  //   return ResponseUtil.handleResponse(
  //     data,
  //     'Image URL updated successfully',
  //     HttpStatus.OK,
  //   );
  // }
}
