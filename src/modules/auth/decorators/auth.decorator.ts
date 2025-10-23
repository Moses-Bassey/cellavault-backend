import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserType } from '../../../enums/user-type.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export const Auth = (roles?: UserType[]) => {
  if (!roles?.length) return applyDecorators(UseGuards(AuthGuard));
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
};
