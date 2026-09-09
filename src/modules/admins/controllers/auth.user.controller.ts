import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DeleteAccountDto } from '../../../shared/dto/delete-account.dto';
import { UserService } from '../services/admin.service';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Auth User')
@Controller('admin/auth/user')
export class AuthUserController {
  constructor(private readonly userService: UserService) {}

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUserAccount(
    @Body() reqBody: DeleteAccountDto,
  ) {
    const { email, password } = reqBody;
    const data = await this.userService.deleteUserAccount(email, password);
    return ResponseUtil.handleResponse(
      {},
      'User account deleted successfully',
      HttpStatus.OK,
    );
  }
}