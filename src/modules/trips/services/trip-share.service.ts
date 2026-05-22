import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TripShareService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  generateShareToken(tripId: string) {
    return this.jwtService.sign(
      {
        tripId,
        type: 'PUBLIC_SHARE',
        v: 1,
      },
      {
        secret: process.env.TRIP_SHARE_SECRET,
        expiresIn: '7d',
      },
    );
  }

  verifyShareToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.TRIP_SHARE_SECRET,
    });
  }
}
