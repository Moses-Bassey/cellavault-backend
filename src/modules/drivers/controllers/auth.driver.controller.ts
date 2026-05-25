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
import { DriverService } from '../services/driver.service';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Auth Driver')
@Controller('admin/auth/driver')
export class AuthDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete driver account' })
  @ApiResponse({
    status: 200,
    description: 'Driver account deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async deleteUserAccount(
    @Body() reqBody: DeleteAccountDto,
  ) {
    const { email, password } = reqBody;
    const data = await this.driverService.deleteDriverAccount(email, password);
    return ResponseUtil.handleResponse(
      {},
      'User account deleted successfully',
      HttpStatus.OK,
    );
  }
}