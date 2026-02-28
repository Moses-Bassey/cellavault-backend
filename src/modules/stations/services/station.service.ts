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
  if (source === 'CNG_FUELING') return 'CNG Station';
  return 'CNG Station';
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
  }): Promise<CursorPageDto<StationListRowDto>> {
    const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 50);
    const cursor = decodeStationCursor(params.cursor);

    const isActive =
      params.status === 'ACTIVE'
        ? true
        : params.status === 'INACTIVE'
          ? false
          : undefined;

    const sources: StationSource[] =
      !params.stationType || params.stationType === 'ALL'
        ? ['CNG', 'CNG_FUELING', 'EV_CHARGING']
        : [params.stationType];

    // Fetch batches in parallel (small batches are ok for admin scale)
    const batchSize = limit; // tune: could be limit or limit*2 for better merge
    const batches = await Promise.all(
      sources.map((source) =>
        this.stationRepository.fetchBatch({
          source,
          limit: batchSize,
          search: params.search,
          isActive,
          badge: params.badge,
          cursor: cursor && cursor.source === source ? cursor : undefined,
        }),
      ),
    );

    // Flatten and merge-sort by updatedAt desc, id desc (stable ordering)
    const merged = batches.flat().sort((a: any, b: any) => {
      const tA = new Date(a.updatedAt).getTime();
      const tB = new Date(b.updatedAt).getTime();
      if (tA !== tB) return tB - tA;
      // tie-breaker by id desc
      return String(b.id).localeCompare(String(a.id));
    });

    const page = merged.slice(0, limit);

    const last = page[page.length - 1];
    const nextCursor =
      page.length === limit && last
        ? encodeStationCursor({
            updatedAt: new Date(last.updatedAt).toISOString(),
            id: last.id,
            source: last.__source,
          })
        : null;

    const items: StationListRowDto[] = page.map((s: any) => ({
      id: s.id,
      source: s.__source,
      name: s.name,
      stationType: stationTypeLabel(s.__source),
      location: locationString(s.state, s.country, s.address),
      address: s.address,
      isActive: !!s.isActive,
      stationBadge: s.stationBadge,
      updatedAt: new Date(s.updatedAt).toISOString(),
    }));

    return { items, nextCursor };
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
