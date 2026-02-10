import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { LGA } from './entities/lga.entity';
import { CountryController } from './controllers/country.controller';
import { CountryService } from './services/country.service';
import { StateService } from './services/state.service';
import { LgaService } from './services/lga.service';
import { CountryRepository } from './repositories/country.repository';
import { StateRepository } from './repositories/state.repository';
import { LgaRepository } from './repositories/lga.repository';

@Module({
  imports: [SequelizeModule.forFeature([Country, State, LGA])],
  controllers: [CountryController],
  providers: [
    CountryService,
    StateService,
    LgaService,
    CountryRepository,
    StateRepository,
    LgaRepository,
  ],
  exports: [
    CountryService,
    StateService,
    LgaService,
    CountryRepository,
    StateRepository,
    LgaRepository,
  ],
})
export class CountriesModule {}
