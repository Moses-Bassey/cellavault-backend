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
}
