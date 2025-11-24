import { CngConversion } from '../entities/cng-conversion.entity';
export declare class CngConversionRepository {
    private cngConversionModel;
    constructor(cngConversionModel: typeof CngConversion);
    count(options?: any): Promise<number>;
    findById(id: string): Promise<CngConversion | null>;
    findAll(options?: any): Promise<CngConversion[]>;
    create(cngConversionData: Partial<CngConversion>): Promise<CngConversion>;
    update(id: string, cngConversionData: Partial<CngConversion>): Promise<[number, CngConversion[]]>;
    delete(id: string): Promise<number>;
}
