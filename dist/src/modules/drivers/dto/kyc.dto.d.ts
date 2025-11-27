import { GENDER } from 'src/enums/gender.enum';
import { IDENTIFICATION_TYPE } from 'src/enums/identification.enums';
import { PROOF_OF_ADDRESS_TYPE } from 'src/enums/proof-of-address-type.enum';
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
    streetAddress?: string;
    landmark?: string;
    postalOrZipCode?: string;
    proofOfAddressType?: PROOF_OF_ADDRESS_TYPE;
    proofOfAddressImage?: string;
}
export declare class ValidateBankAccountDto {
    bankCode: string;
    accountNo: string;
}
export declare class UpdateBankAccountDto {
    bankCode: string;
    accountNo: string;
    accountName: string;
    bankName: string;
}
