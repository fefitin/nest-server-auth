import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: '$property' })
  username: string;

  @IsNotEmpty({ message: '$property' })
  password: string;

  @IsNotEmpty({ message: '$property' })
  name: string;

  @IsEmail({}, { message: '$property' })
  email: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: '$property' })
  username: string;

  @IsOptional()
  @IsNotEmpty({ message: '$property' })
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: '$property' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: '$property' })
  email: string;
}
