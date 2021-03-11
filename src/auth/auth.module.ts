import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { RefreshToken } from './refresh-token';
import {
  CookieModule,
  ExpressCookieInterceptor,
  CookieSameSite,
} from '@nestifyjs/cookie';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SequelizeModule.forFeature([RefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
    CookieModule.register(ExpressCookieInterceptor, {
      encode: String,
      decode: String,
      httpOnly: true,
      path: '/',
      secure: false,
      signed: true,
      sameSite: CookieSameSite.Strict,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
