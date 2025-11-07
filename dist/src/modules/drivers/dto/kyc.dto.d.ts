import { GENDER } from 'src/enums/gender.enum';
import { IDENTIFICATION_TYPE } from 'src/enums/identification.enums';
export declare class CreateKyc1Dto {
    fullName: string;
    phoneNo: string;
    countryId: string;
    email: string;
    gender: GENDER;
    dateOfBirth: string;
    phoneBrand: string;
    phoneModel: string;
    schoolCertificateImageUrl?: string;
    utilityBillImageUrl?: string;
}
export declare class CreateKyc2Dto {
    identificationType: IDENTIFICATION_TYPE;
    identificationNumber: string;
    identificationImageUrl: string;
}
export declare class CreateKyc3Dto {
    stateId: string;
    city: string;
    verified?: boolean;
}
