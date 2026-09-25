import { UserType } from 'src/enums';
import { User } from 'src/modules/users/entities/user.entity';

export interface ILoginData {
  accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string | null;
      phoneNo: string | null;
      role: User['role'];
    };
}
