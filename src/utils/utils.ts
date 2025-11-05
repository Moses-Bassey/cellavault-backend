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
}
