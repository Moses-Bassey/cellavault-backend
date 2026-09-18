import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
  Logger,
 } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { TutorRepository } from '../repositories/tutor.repository';
import { TokenService } from 'src/services/token/token.service';
import { EmailEventService } from 'src/services/mail/email-event.service';
import { Tutor } from '../entities/tutor.entity';
import { UserType } from '../../../enums/user-type.enum';
import { TokenSubject } from 'src/enums/token.enum';
import { Utils } from 'src/utils/utils';
import { decodeCursor } from '../../../utils/cursor.util';
import { PasswordUtil, generatePassword } from '../../../utils/password.util';
import { QueryOptions } from '../../../shared/interfaces/query-options.interface';
import { ICreateTutorInput } from '../interfaces/tutor.interface';
import { TutorCreatedEvent } from '../events/tutor.event';

@Injectable()
export class TutorService {
  private readonly logger = new Logger(TutorService.name);

  constructor(
    private readonly tutorRepository: TutorRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly emailEventService: EmailEventService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}


//   async createTutor(data: ICreateTutorInput): Promise<ICreateTutorInput> {
//     const tutor = await this.tutorRepository.create(data);
//     if (!tutor) throw new InternalServerErrorException('Failed to create tutor');
//     return data;
//   }

  async getAllTutors(
    params: QueryOptions,
  ): Promise<{ items: Tutor[]; nextCursor: string | null }> {

    const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 50);
    const cursor = params.cursor ? decodeCursor(params.cursor) : undefined;

    const { tutors, nextCursor } = await this.tutorRepository.findAll({
      search: params.search?.trim(),
      limit,
      cursor,
    });

    return {
      items: tutors,
      nextCursor,
    };
  }
  
  /**
   * Create a tutor, generate a temporary password, persist and emit a fire-and-forget
   * email event that will be handled by a listener to send the invite email.
   */
  async createTutor(data: ICreateTutorInput): Promise<ICreateTutorInput> {
    // 1. Generate a secure temporary password
    const tempPassword = Utils.generateRandomPassword(10);
    const hashedPassword = await PasswordUtil.hashPassword(tempPassword);

    // 2. Prepare payload for persistence
    const payload: Partial<Tutor> = {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      phone: data.phone 
        ? Utils.normalizeCountryPhone('+234', data.phone, 13) 
        : undefined,
      password: hashedPassword,
      role: UserType.TUTOR,
      isActive: true,
    };

    console.log('Normalized phone: ', payload.phone);

    // 3. Persist tutor and handle DB errors
    let tutor: Tutor;
    try {
      tutor = await this.tutorRepository.create(payload);
    } catch (error: any) {
      this.logger.error('Failed to create tutor', error);
      throw new Error('Failed to create tutor');
    }

    if (!tutor) {
      throw new InternalServerErrorException('Failed to create tutor');
    }

    // 4. Fire-and-forget: emit an email event with only tutor fields that exist in the table
    // Do not await the emission; let the listener handle sending the email asynchronously.
    // 4. Emit fire-and-forget event (do not await any listener)
    try {
      const tutorLoginUrl = `${this.configService.get<string>('app.tutorWebUrl')}/login`;
      const event = new TutorCreatedEvent(
        tutor.id,
        tutor.email,
        tutor.name,
        tutorLoginUrl,
        tempPassword,
      );
      // synchronous emit; listeners run asynchronously and are responsible for errors
      this.eventEmitter.emit('tutor.created', event);
    } catch (emitError) {
      // Emission failure should not block creation; log and continue
      this.logger.error('Failed to emit tutor invite email event', emitError);
    }

    // 5. Return minimal confirmation (avoid returning password or full entity)
    return data;
  }
}
