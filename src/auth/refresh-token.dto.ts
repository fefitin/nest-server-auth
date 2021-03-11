import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: '$property' })
  accessToken: string;

  @IsNotEmpty({ message: '$property' })
  refreshToken: string;
}
