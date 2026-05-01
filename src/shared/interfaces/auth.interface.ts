import { UserType } from 'src/enums';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';

export interface IDriverLoginData {
  id: string;
  token: string;
  userType: UserType;
  userId: string;
  email: string;
  kycCompleted: KYC_COMPLETED;
  isGuarantorCompleted: boolean;
}

export interface IUserLoginData {
  id: string;
  token: string;
  userType: UserType;
  userId: string;
  email: string;
}

export interface IAdminLoginData {
  token: string;
  user: {
    id: string;
    role: UserType;
    email: string;
  };
}
