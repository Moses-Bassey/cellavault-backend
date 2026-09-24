import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { UserLoginIdentityType } from 'src/enums';

@Injectable()
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async findForAuthentication(
    type: UserLoginIdentityType,
    value: string,
  ): Promise<User | null> {
    if (type === UserLoginIdentityType.EMAIL) {
      return User.unscoped().findOne({
        where: {
          email: value,
        },
      });
    }

    return User.unscoped().findOne({
      where: {
        phoneNo: value,
      },
    });
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    return User.findOne({
      where: {
        email,
      },
    });
  }

  async findByPhoneNo(
    phoneNo: string,
  ): Promise<User | null> {
    return User.findOne({
      where: {
        phoneNo,
      },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await User.findOne({
      attributes: ['id'],
      where: {
        email,
      },
    });

    return !!user;
  }

  async existsByPhoneNo(phoneNo: string): Promise<boolean> {
    const user = await User.findOne({
      attributes: ['id'],
      where: {
        phoneNo,
      },
    });

    return !!user;
  }

  async create(data: Partial<User>): Promise<User> {
    return User.create(data as any);
  }

  async update(
    user: User,
    data: Partial<User>,
  ): Promise<User> {
    await user.update(data);

    return user;
  }
}