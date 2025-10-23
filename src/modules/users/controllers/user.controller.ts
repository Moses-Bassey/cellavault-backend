import { Controller, Get, Param, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get(':id')
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findById(id);
  }

  @Put(':id')
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<[number, User[]]> {
    return await this.userService.update(id, userData);
  }

//   @Delete(':id')
//   @Roles(UserType.SUPER_ADMIN)
//   @ApiOperation({ summary: 'Soft delete user' })
//   @ApiResponse({ status: 200, description: 'User deleted successfully' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   async delete(@Param('id') id: string): Promise<number> {
//     return await this.userService.delete(id);
//   }

//   @Put(':id/restore')
//   @Roles(UserType.SUPER_ADMIN)
//   @ApiOperation({ summary: 'Restore soft deleted user' })
//   @ApiResponse({ status: 200, description: 'User restored successfully' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   async restore(@Param('id') id: string): Promise<void> {
//      await this.userService.restore(id);
//   }

//   @Get()
//   @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
//   @ApiOperation({ summary: 'Get all users' })
//   @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
//   async findAll(): Promise<User[]> {
//     return await this.userService.findAll();
//   }
}
