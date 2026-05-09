import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StationRepository } from '../repositories/station.repository';
import {
  CursorPageDto,
  StationDetailsDto,
  StationListRowDto,
  StationsSummaryDto,
  StationSource,
  CreateStationDto,
} from '../dto/station.dto';
import {
  decodeStationCursor,
  encodeStationCursor,
  StationCursor,
} from '../utils/station-cursor.util';
import { StationBadge } from 'src/enums/station-badge.enum';

function locationString(
  state?: string | null,
  country?: string | null,
  address?: string | null,
) {
  const parts = [state, country].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return address ?? '';
}

function stationTypeLabel(source: StationSource) {
  if (source === 'EV_CHARGING') return 'EV Station';
  if (source === 'CNG') return 'CNG Station';
  if (source === 'CNG_CONVERSION') return 'CNG Conversion Station';

  return 'Station';
}

@Injectable()
export class StationService {
  constructor(private readonly stationRepository: StationRepository) {}

  async createStation(dto: CreateStationDto) {
    const name = dto.name.trim();
    const address = dto.address.trim();

    if (!name) throw new BadRequestException('Station name is required');
    if (!address) throw new BadRequestException('Address is required');

    // Optional: prevent duplicates (simple heuristic)
    const exists = await this.stationRepository.existsByNameAndAddress(
      dto.stationType,
      name,
      address,
    );
    if (exists) throw new BadRequestException('Station already exists');

    const created = await this.stationRepository.createStation(
      dto.stationType,
      {
        name,
        address,
        state: dto.state?.trim() || null,
        country: dto.country?.trim() || 'Nigeria',
        // set defaults
        openingTime: '08:00:00',
        closingTime: '18:00:00',
      },
    );

    return {
      id: created.id,
      source: dto.stationType,
      name: created.name,
      address: created.address,
      state: created.state ?? null,
      country: created.country ?? null,
      isActive: created.isActive,
      createdAt: created.createdAt,
    };
  }

  async getSummary(): Promise<StationsSummaryDto> {
    return this.stationRepository.getSummary();
  }

  async listStations(params: {
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    stationType?: StationSource | 'ALL';
    badge?: StationBadge;
    limit?: number;
    cursor?: string;
  }): Promise<
    CursorPageDto<StationListRowDto> & {
      total: number;
    }
  > {
    // max limit is now fixed at 10
    const limit = Math.min(
      Number(params.limit ?? 10),
      10,
    );

    const cursor = decodeStationCursor(params.cursor);

    const isActive =
      params.status === 'ACTIVE'
        ? true
        : params.status === 'INACTIVE'
          ? false
          : undefined;

    // default to CNG if ALL is not supported
    const source: StationSource =
      !params.stationType ||
      params.stationType === 'ALL'
        ? 'CNG'
        : params.stationType;

    const batch = await this.stationRepository.fetchBatch({
      source,
      limit,
      search: params.search,
      isActive,
      badge: params.badge,
      cursor,
    });

    const page = batch.items;

    const last = page[page.length - 1];

    const nextCursor =
      page.length === limit && last
        ? encodeStationCursor({
            updatedAt: new Date(
              last.updatedAt,
            ).toISOString(),

            id: last.id,

            source: last.__source,
          })
        : null;

    const items: StationListRowDto[] =
      page.map((s: any) => ({
        id: s.id,
        source: s.__source,
        name: s.name,
        stationType: stationTypeLabel(
          s.__source,
        ),
        location: locationString(
          s.state,
          s.country,
          s.address,
        ),
        address: s.address,
        isActive: !!s.isActive,
        stationBadge: s.stationBadge,
        updatedAt: new Date(
          s.updatedAt,
        ).toISOString(),
      }));

    return {
      items,
      nextCursor,
      total: batch.total,
    };
  }

  async getStationDetails(
    source: StationSource,
    id: string,
  ): Promise<StationDetailsDto> {
    const station = await this.stationRepository.findById(source, id);
    if (!station) throw new NotFoundException('Station not found');

    return {
      id: station.id,
      source,
      name: station.name,
      state: station.state ?? null,
      country: station.country ?? null,
      address: station.address,

      contactPhone: station.contactPhone,
      contactEmail: station.contactEmail,

      stationBadge: station.stationBadge,

      openingTime: station.openingTime,
      closingTime: station.closingTime,

      amountPerUnit: Number(station.amountPerUnit),
      amountPerUnitType: station.amountPerUnitType,
      currency: station.currency,

      rating: 'rating' in station ? (station.rating ?? null) : null,

      reviews: 'reviews' in station ? (station.reviews ?? null) : null,

      latitude: station.latitude ?? null,
      longitude: station.longitude ?? null,
      stationImage: station.stationImage ?? null,

      isActive: !!station.isActive,

      createdAt: station.createdAt.toISOString(),
      updatedAt: station.updatedAt.toISOString(),
    };
  }

  async updateStation(
    source: StationSource,
    id: string,
    patch: Partial<{
      name: string;
      state: string;
      country: string;
      address: string;
      contactPhone: string;
      contactEmail: string;
      openingTime: string;
      closingTime: string;
      amountPerUnit: number;
      currency: string;
      amountPerUnitType: string;
      stationBadge: StationBadge;
      latitude: number;
      longitude: number;
      stationImage: string;
    }>,
  ): Promise<StationDetailsDto> {
    if (patch.contactEmail && !patch.contactEmail.includes('@')) {
      throw new BadRequestException('Invalid email');
    }

    const updated = await this.stationRepository.updateStation(
      source,
      id,
      patch as any,
    );
    if (!updated) throw new NotFoundException('Station not found');

    return this.getStationDetails(source, id);
  }

  async setStationActive(source: StationSource, id: string, isActive: boolean) {
    const updated = await this.stationRepository.updateStation(source, id, {
      isActive,
    });
    console.log('Is active:', isActive);
    if (!updated) throw new NotFoundException('Station not found');
    return { ok: true };
  }
}
