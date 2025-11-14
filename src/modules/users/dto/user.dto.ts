import { IsEmail, IsEnum, IsString, isUUID } from "class-validator";
import { UserType } from "src/enums";

export class DashboardDto{
    @IsString()
    userId: string;
    
    @IsString()
    deviceFCMToken: string;

    @IsString()
    ipAddress: string;

    @IsString()
    name: string;

    @IsEnum(UserType)
    userType: UserType;
}