import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './entities/country.entity';
import { CountryController } from './controllers/country.controller';
import { CountryService } from './services/country.service';
import { CountryRepository } from './repositories/country.repository';

@Module({
  imports: [SequelizeModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService, CountryRepository],
  exports: [CountryService, CountryRepository],
})
export class CountriesModule {}
