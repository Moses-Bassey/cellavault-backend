import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../../enums/user-type.enum';

export const USERTYPES_KEY = 'userTypes';
export const Roles = (...roles: UserType[]) =>
  SetMetadata(USERTYPES_KEY, roles);
