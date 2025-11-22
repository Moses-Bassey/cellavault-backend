import { Model } from 'sequelize-typescript';
import { UserType } from '../../../enums/user-type.enum';
import { Country } from '../../countries/entities/country.entity';
import { LoginType } from 'src/enums/login-type.enum';
export declare class User extends Model<User> {
    id: string;
    fullName: string;
    phoneNo: string;
    email: string;
    userType: UserType;
    password: string;
    loginType: LoginType;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isActive: boolean;
    isDisabled: boolean;
    hasPasscode: boolean;
    countryId: string;
    country: Country;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
