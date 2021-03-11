import {
  Column,
  Model,
  Table,
  BeforeUpdate,
  BeforeCreate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  email: string;

  @BeforeUpdate
  @BeforeCreate
  static async processPwd(instance: User) {
    if (instance.changed('password')) {
      instance.password = await instance.hashPassword(instance.password);
    }
  }

  async isPasswordValid(pwd: string): Promise<boolean> {
    return await bcrypt.compare(pwd, this.password);
  }

  async hashPassword(pwd: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_HASH_ROUNDS);
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(pwd, salt);
  }

  toJSON() {
    const values: any = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}
