import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CookieController } from '@nestifyjs/cookie';

/*
  If accessToken cookie is present, copy
  to authorization header so that jwtGuard can validate it.

  If accessToken is expired, refreshToken is used to regenerate it.
*/
@Injectable()
export class AuthCookieToHeaderMiddleware extends CookieController
  implements NestMiddleware {
  constructor(private authService: AuthService) {
    super();
  }

  async use(req: any, res: Response, next: Function) {
    if (!req.headers.authorization && req.cookies && req.cookies.accessToken) {
      const token = await this.verifyOrRefresh(req.cookies);
      req.headers.authorization = `Bearer ${token.accessToken}`;

      //Update cookies with new token
      if (token.accessToken !== req.cookies.accessToken) {
        this.setCookie(req, 'accessToken', token.accessToken);
        this.setCookie(req, 'refreshToken', token.refreshToken);
      }
    }
    next();
  }

  /*
    Verify accessToken, if invalid use
    refreshToken to generate a new one.
  */
  async verifyOrRefresh(token) {
    try {
      this.authService.verifyToken(token.accessToken);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const newToken = await this.authService.refreshToken(
          token.accessToken,
          token.refreshToken,
        );

        if (newToken) {
          token = newToken;
        }
      }
    }

    return token;
  }
}
