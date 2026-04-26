import { BadRequestException } from '@nestjs/common';

export function parseISODateOrUndefined(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return d;
}