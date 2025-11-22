import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
import { Country } from 'src/modules/countries/entities/country.entity';
import { GUARANTOR_STATUS } from 'src/enums/guarantor-status.enum';
export declare class Guarantor extends Model<Guarantor> {
    id: string;
    driverId: string;
    driver: Driver;
    fullName: string;
    phoneNo: string;
    email: string;
    identificationImageUrl: string;
    utilityBillImageUrl: string;
    policeClearanceImageUrl: string;
    reference: string;
    countryId: string;
    country: Country;
    status: GUARANTOR_STATUS;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
