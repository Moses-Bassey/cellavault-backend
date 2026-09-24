import { BadRequestException } from '@nestjs/common';
import { UserLoginIdentityType } from 'src/enums';

export interface NormalizedLoginIdentity {
  value: string;
  type: UserLoginIdentityType;
}

export class AuthIdentityUtil {
  static normalize(identity: string): NormalizedLoginIdentity {
    const value = identity.trim();

    if (!value) {
      throw new BadRequestException('Login identity is required');
    }

    if (this.isEmail(value)) {
      return {
        value: value.toLowerCase(),
        type: UserLoginIdentityType.EMAIL,
      };
    }

    const phoneNo = this.normalizePhone(value);

    return {
      value: phoneNo,
      type: UserLoginIdentityType.PHONE_NO,
    };
  }

  private static isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private static normalizePhone(value: string): string {
    /**
     * Replace this with your existing centralized phone utility.
     *
     * The important thing is that every phone number is stored and
     * searched in exactly one canonical format.
     */
    return value.replace(/\s+/g, '');
  }
}