import { BadGatewayException, BadRequestException } from '@nestjs/common';
import * as randomstring from 'randomstring';
import { UserLoginIdentityType } from 'src/enums';

export class Utils {

  /**
   * Retrieve login identity type
   * @param {string} identity - user identity 
   * @returns {UserLoginIdentityType} login identity type check
   */
  static getLoginIdentityType(identity: string){
    if (!identity){
        throw new BadRequestException("Invalid identity")
    }

    if(identity.includes("@")){
        return UserLoginIdentityType.EMAIL
    }

    return UserLoginIdentityType.PHONE_NO
  }

 /**
   * Normalize a phone no for a country
   * @param {string} countryCode - User country code (e.g., +234)
   * @param {string} phoneNo - User phone number (e.g., 8150862044)
   * @param {number} phoneNoLength - Expected total length of the normalized phone number (e.g., 13)
   * @returns {string} Normalized phone number (e.g., 2348150862044) or null if invalid length
   */
  static normalizeCountryPhone(countryCode: string, phoneNo: string, phoneNoLength: number): string {

    const normalizedCountryCode = countryCode.startsWith('+') ? countryCode.slice(1) : countryCode;
    let normalizedPhoneNo = phoneNo;

    if (normalizedPhoneNo.startsWith(normalizedCountryCode)) {
      normalizedPhoneNo = normalizedPhoneNo.slice(normalizedCountryCode.length);
    }

    const normalizedFullPhoneNo = normalizedCountryCode + normalizedPhoneNo;
    if (phoneNo.length === phoneNoLength) {
      return normalizedFullPhoneNo;
    }

    throw new BadRequestException('Invalid phone number')
  }

  static phoneSMSFormat(phone: string): string {
    if (!phone) {
      throw new BadRequestException('Invalid phone number')
    }

    return "+" + phone;
  }
}
