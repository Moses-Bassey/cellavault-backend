import { UserType } from '../../../enums/user-type.enum';

export interface UpdateTutorProfileData {
  name?: string;
  email?: string;
  phone?: string | null;
}

export interface ChangeTutorPasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface TutorProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTutorInput {
  name: string;
  email: string;
  phone?: string;
}
