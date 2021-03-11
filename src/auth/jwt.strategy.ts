import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /*
    The object returned from this function
    will be appended to all requests in
    the user property
  */
  async validate(payload: any) {
    //Payload is a valid (already verified by Passport) and decoded JWT token
    const user = await this.authService.findByUserId(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
