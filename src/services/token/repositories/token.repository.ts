import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Token } from '../entities/token.entity';

@Injectable()
export class TokenRepository {

  constructor(
    @InjectModel(Token)
    private tokenModel: typeof Token,
  ) {}

  async create(tokenData: Partial<Token>): Promise<Token> {
    return await this.tokenModel.create(tokenData as any);
  }

  async findByToken(token: string): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: { token },
      attributes: ['id', 'expiry', 'email'],
    });
  }

  async delete(id: string): Promise<number> {
    return await this.tokenModel.destroy({
      where: { id },
    });
  }

  async deleteByToken(token: string): Promise<number> {
    return await this.tokenModel.destroy({
      where: { token },
    });
  }
}
