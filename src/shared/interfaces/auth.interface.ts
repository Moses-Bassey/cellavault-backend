import { UserType } from 'src/enums';

export interface ILoginData {
  token: string;
  user: {
    id: string;
    role: UserType;
    email: string;
    name?: string;
  };
}
