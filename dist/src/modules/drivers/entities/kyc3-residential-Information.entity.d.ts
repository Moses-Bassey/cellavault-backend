import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
import { State } from '../../countries/entities/state.entity';
import { PROOF_OF_ADDRESS_TYPE } from '../../../enums/proof-of-address-type.enum';
export declare class kyc3ResidentialInformation extends Model<kyc3ResidentialInformation> {
    id: string;
    stateId: string;
    state: State;
    city: string;
    streetAddress: string;
    landmark: string;
    postalOrZipCode: string;
    proofOfAddressType: PROOF_OF_ADDRESS_TYPE;
    proofOfAddressImage: string;
    verified: boolean;
    driverId: string;
    driver: Driver;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
