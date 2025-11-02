import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { ClientDeviceGuard } from '../guards/client-device.guard';

export function VerifyClientDevice() {
  return applyDecorators(
    UseGuards(ClientDeviceGuard),
    ApiBearerAuth(),
    ApiHeader({
      name: 'x-client-device-token',
      description: 'Client device token for verification',
      required: true,
    }),
  );
}

