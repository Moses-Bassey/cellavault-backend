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

export function encodeCursor(params: { createdAt: Date; id: string; }): string {
  return Buffer.from(JSON.stringify({ createdAt: params.createdAt, id: params.id }),).toString('base64');
}
