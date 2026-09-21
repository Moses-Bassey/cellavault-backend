import { UserType } from '../../../enums/user-type.enum';
export interface UpdateStudentProfileData {
  name?: string;
  email?: string;
  phone?: string;
  guardianPhoneOrEmail?: string;
  gender?: string;
  photoUrl?: string;
}

export interface ChangeStudentPasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface StudentProgrammeProfile {
  id: string;
  name: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  guardianPhoneOrEmail: string | null;
  gender: string | null;
  photoUrl: string | null;
  role: UserType;
  isActive: boolean;
  programmes: StudentProgrammeProfile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStudentInput {
  name: string;
  email: string;
  phone?: string | null;
  guardianPhoneOrEmail?: string | null;
  password: string; // hashed password expected by repository
  gender?: string | null;
  photoUrl?: string | null;
  role?: string; // default to UserType.STUDENT in service
}
