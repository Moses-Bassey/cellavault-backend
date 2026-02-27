import { BadRequestException } from '@nestjs/common';

export function decodeCursor(
  cursor?: string,
): { createdAt: Date; id: string } | undefined {
  if (!cursor) return undefined;
  try {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
    return { createdAt: new Date(decoded.createdAt), id: decoded.id };
  } catch {
    throw new BadRequestException('Invalid cursor');
  }
}
