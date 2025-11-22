export declare class CreateGuarantorDto {
    fullName: string;
    phoneNo: string;
    email: string;
    identificationImageUrl?: string;
    utilityBillImageUrl?: string;
    policeClearanceImageUrl?: string;
    reference?: string;
    country: string;
}
export declare class CreateGuarantorsDto {
    guarantors: CreateGuarantorDto[];
}
