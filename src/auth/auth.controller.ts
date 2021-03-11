import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body,
} from '@nestjs/common';
import { LoginGuard } from './../common/guards/login.guard';
import { CookieController } from '@nestifyjs/cookie';
import { AuthenticatedGuard } from './../common/guards/authenticated.guard';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './refresh-token.dto';

@Controller('auth')
export class AuthController extends CookieController {
  constructor(private authService: AuthService) {
    super();
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  async login(@Request() req): Promise<any> {
    const token = await this.authService.login(req.user);
    this.setCookie(req, 'accessToken', token.accessToken);
    this.setCookie(req, 'refreshToken', token.refreshToken);
    return token;
  }

  @Post('/refresh_token')
  async refresh(
    @Request() req,
    @Body() refresh: RefreshTokenDto,
  ): Promise<any> {
    const token = await this.authService.refreshToken(
      refresh.accessToken,
      refresh.refreshToken,
    );
    this.setCookie(req, 'accessToken', token.accessToken);
    this.setCookie(req, 'refreshToken', token.refreshToken);
    return token;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/me')
  getHome(@Request() req) {
    return req.user;
  }
}
