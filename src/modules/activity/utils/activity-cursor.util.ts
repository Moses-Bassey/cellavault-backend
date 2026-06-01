import { BadRequestException } from '@nestjs/common';

export interface ActivityCursor {
  id: string;
  lastActiveAt: string;
  /**
   * Numeric sort key: 0 = online, 1 = idle, 2 = offline.
   * Stored so the cursor is self-contained for future server-side
   * split-query optimisation without breaking existing cursors.
   */
  statusOrder: number;
}

export function decodeActivityCursor(
  cursor?: string,
): ActivityCursor | undefined {
  if (!cursor) return undefined;

  try {
    return JSON.parse(
      Buffer.from(cursor, 'base64').toString('utf8'),
    ) as ActivityCursor;
  } catch {
    throw new BadRequestException('Invalid cursor');
  }
}

export function encodeActivityCursor(
  params: ActivityCursor,
): string {
  return Buffer.from(
    JSON.stringify(params),
  ).toString('base64');
}