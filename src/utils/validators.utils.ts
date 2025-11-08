import { BadGatewayException, BadRequestException } from '@nestjs/common';
import * as randomstring from 'randomstring';
import { UserLoginIdentityType } from 'src/enums';

export class Validators {

  /**
   * Validate email and transform email to lowercase
   * @param {string} email - email to validate
   * @returns {string} transform and validated email
   */
  static validateEmail(email: string): string {
    if(!email){
        throw new BadGatewayException('Invalid email provided')
    }

    email = email.toLowerCase();

    const invalidEmailDomains = ['mailinator.com']
    const emailDomain = email.split("@")[1]

    invalidEmailDomains.forEach(domain => {
        if (domain == emailDomain){
            throw new BadRequestException('Invalid email domain')
        }
    }) 

    return email;
  }

  /**
   * Retrieve login identity type
   * @param {string} identity - user identity 
   * @returns {UserLoginIdentityType} login identity type check
   */
  static getLoginIdentity(identity: string){
    if (!identity){
        throw new BadRequestException("Invalid identity")
    }

    if(identity.includes("@")){
        return UserLoginIdentityType.EMAIL
    }

    return UserLoginIdentityType.PHONE_NO
  }

  /**
   * Validate UUID
   * @param {string} value - value to validate
   * @returns {string} validated value
   */
  static validateUuid(value: string): string {
    // Check if the value is a valid UUID v4 format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new BadRequestException('Invalid UUID format');
    }

    return value;
  }

}
