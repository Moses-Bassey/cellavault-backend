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
