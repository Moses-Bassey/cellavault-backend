import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}

  async dashboard(){
    
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findByIdentity(identity: string): Promise<User | null> {
    return await this.userRepository.findByIdentity(identity);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findAll(options?: any): Promise<User[]> {
    return await this.userRepository.findAll(options);
  }

  async update(id: string, userData: Partial<User>): Promise<[number, User[]]> {
    return await this.userRepository.update(id, userData);
  }

  async delete(id: string): Promise<number> {
    return await this.userRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.userRepository.restore(id);
  }
}
