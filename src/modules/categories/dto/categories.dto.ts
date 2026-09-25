import { IsString, IsNotEmpty } from 'class-validator';

export class CategoriesDto {
    @IsString()
    name!: string;

    @IsNotEmpty()
    description!: string;
}