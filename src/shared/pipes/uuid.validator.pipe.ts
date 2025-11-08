import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UuidValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // Check if the value is a valid UUID v4 format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new BadRequestException('Invalid UUID format');
    }

    return value;
  }
}
