import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProgrammeService } from '../services/programme.service';
import { GetProgrammesQueryDto } from '../dto/programme.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Programmes')
@Controller('programmes')
export class ProgrammeController {
  constructor(private readonly programmeService: ProgrammeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all programmes' })
  @ApiResponse({ status: 200, description: 'Programmes retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Programmes not found' })
  async getAllProgrammes(@Query() query: GetProgrammesQueryDto) {
    const data = await this.programmeService.getAllProgrammes({
      search: query.search,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });

    return ResponseUtil.handleResponse(
      data,
      'Programmes retrieved successfully',
      HttpStatus.OK,
    );
  }
}
