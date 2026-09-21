import { UserType } from '../../../enums/user-type.enum';

export interface AdminProfile {
  id: string;
  email: string;
  role: UserType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateAdminProfileData {
  email?: string;
}

export interface ChangeAdminPasswordData {
  currentPassword: string;
  newPassword: string;
}