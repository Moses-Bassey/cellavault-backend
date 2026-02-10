import { TokenSubject } from 'src/enums/token.enum';

export interface IOTPInterface {
  email?: string;
  token: string;
  phoneNo?: string;
  subject: TokenSubject;
}
