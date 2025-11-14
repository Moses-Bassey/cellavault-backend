import { IsEmail, IsEnum, IsOptional, IsString, isUUID } from "class-validator";
import { UserType } from "src/enums";

export class DashboardDto{
    @IsString()
    deviceFCMToken: string;

    @IsString()
    @IsOptional()
    name?: string;
}