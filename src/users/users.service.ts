import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto, UpdateUserDto } from './user.dto';
import { Op } from 'sequelize';
import { ValidationException } from 'src/common/exceptions/validation.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[] | undefined> {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  findByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      where: { username },
    });
  }

  findByUserId(userId: number): Promise<User | undefined> {
    return this.userModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
  }

  findById(id: number): Promise<User | undefined> {
    return this.userModel.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
  }

  async create(user: UserDto): Promise<User | undefined> {
    const valid = await this.validateUsername(user.username);
    if (!valid) {
      throw new ValidationException('username');
    }

    const newUser = this.userModel.build();
    newUser.set(user);
    return newUser.save();
  }

  async update(userId: number, user: UpdateUserDto): Promise<User | undefined> {
    const valid = await this.validateUsername(user.username, userId);
    if (!valid) {
      throw new ValidationException('username');
    }

    const existing = await this.findById(userId);
    if (existing) {
      existing.set(user);
      existing.save();

      return existing;
    } else {
      return null;
    }
  }

  async delete(userId: number): Promise<boolean> {
    const existing = await this.findById(userId);
    if (existing) {
      await existing.destroy();
      return true;
    } else {
      return false;
    }
  }

  async validateUsername(username: string, userId?: number): Promise<boolean> {
    //Check if username is already used
    if (!username) {
      return true;
    }

    //Search by email
    let where = { username };

    //Exclude userId (for updates)
    if (!isNaN(userId)) {
      where = Object.assign({}, where, { id: { [Op.ne]: userId } });
    }

    const exists = await this.userModel.findOne({
      where,
    });
    return !exists;
  }
}
