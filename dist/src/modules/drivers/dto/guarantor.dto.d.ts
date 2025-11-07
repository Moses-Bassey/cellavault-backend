export declare class CreateGuarantorDto {
    fullName: string;
    phoneNo: string;
    email: string;
    identificationImageUrl?: string;
    utilityBillImageUrl?: string;
    policeClearanceImageUrl?: string;
}
export declare class CreateGuarantorsDto {
    guarantors: CreateGuarantorDto[];
}
