import { BadRequestException } from '@nestjs/common';
import { StationSource } from '../dto/station.dto';

export type StationCursor = {
  updatedAt: string;
  id: string;
  source: StationSource;
};

export function encodeStationCursor(c: StationCursor) {
  return Buffer.from(JSON.stringify(c)).toString('base64');
}

export function decodeStationCursor(
  cursor?: string,
): StationCursor | undefined {
  if (!cursor) return undefined;
  try {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
    if (!decoded?.updatedAt || !decoded?.id || !decoded?.source) {
      throw new Error('bad cursor');
    }
    return decoded as StationCursor;
  } catch {
    throw new BadRequestException('Invalid cursor');
  }
}
