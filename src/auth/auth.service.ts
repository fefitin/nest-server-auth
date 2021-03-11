import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { uid } from 'rand-token';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './refresh-token';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(RefreshToken)
    private refreshTokenModel: typeof RefreshToken,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const valid = await user.isPasswordValid(password);
    if (valid) {
      return {
        id: user.id,
        username: user.username,
      };
    } else {
      return null;
    }
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
  }

  async findByUserId(id: number): Promise<any> {
    const user = await this.usersService.findByUserId(id);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      username: user.username,
    };
  }

  generateRefreshToken(jwtPayload: any) {
    const token = uid(256);
    const refresh = this.refreshTokenModel.build();
    refresh.userId = jwtPayload.sub;
    refresh.username = jwtPayload.username;
    refresh.refreshToken = token;
    refresh.save();
    return token;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    let decoded;

    try {
      decoded = await this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
        ignoreExpiration: true,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }

    const search = await this.refreshTokenModel.findOne({
      where: {
        refreshToken,
        userId: decoded.sub,
      },
    });
    if (search) {
      await search.destroy();
      const user = await this.usersService.findByUserId(decoded.sub);
      if (user) {
        return this.login(user);
      }
    }

    throw new UnauthorizedException();
  }
}
