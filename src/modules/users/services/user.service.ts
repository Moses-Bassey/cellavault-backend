import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}

  async dashboard(){
    
  }

  async fetchUser(id: string): Promise<User | null> {
    const user = await this.userRepository.fetchUser(id)
    if (!user){
      throw new NotFoundException('User not found!')
    }
    return user;
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
