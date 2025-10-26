import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Token } from '../entities/token.entity';
import { Op } from 'sequelize';
import { TokenSubject } from 'src/enums/token.enum';

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

  async findByPhoneOrEmailToken(token: string, phoneNo: string, email: string): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: { [Op.or]: [
        { email: email },
        { phoneNo: phoneNo },
        { token: token }
        ], },
      attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
    });
  }

  async findByEmailToken(token: string, email: string): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: { email, token },
      attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
    });
  }

  async findByEmailTokenAndSubject(token: string, email: string, subject: TokenSubject): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: { email, token },
      attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
    });
  }

  async findByPhoneToken(token: string, phoneNo: string): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: { phoneNo, token },
      attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
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
