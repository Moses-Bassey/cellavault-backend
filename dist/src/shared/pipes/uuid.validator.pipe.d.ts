import { PipeTransform } from '@nestjs/common';
export declare class UuidValidationPipe implements PipeTransform<string, string> {
    transform(value: string): string;
}
