import { UserType } from "src/enums";

export interface JwtAuthPayload {
  sub: string;
  email: string;
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
