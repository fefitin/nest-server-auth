import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model<RefreshToken> {
  @Column
  userId: number;

  @Column
  username: string;

  @Column
  refreshToken: string;
}
