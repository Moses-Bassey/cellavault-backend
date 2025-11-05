import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { CountryController } from './controllers/country.controller';
import { CountryService } from './services/country.service';
import { StateService } from './services/state.service';
import { CountryRepository } from './repositories/country.repository';
import { StateRepository } from './repositories/state.repository';

@Module({
  imports: [SequelizeModule.forFeature([Country, State])],
  controllers: [CountryController],
  providers: [CountryService, StateService, CountryRepository, StateRepository],
  exports: [CountryService, StateService, CountryRepository, StateRepository],
})
export class CountriesModule {}
