import { UserType } from '../../../enums/user-type.enum';
export declare const USERTYPES_KEY = "userTypes";
export declare const Roles: (...roles: UserType[]) => import("@nestjs/common").CustomDecorator<string>;
