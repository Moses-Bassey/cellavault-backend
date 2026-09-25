import { UserType } from 'src/enums';
import { Request } from 'express';

export interface JwtAuthPayload {
  sub: string;
  identity: string;
  userType: UserType;
  userId: string;
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  userType: UserType;
}

export interface AuthenticatedRequest extends Request {
  user: JwtAuthPayload;
}
