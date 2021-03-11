import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticatedGuard extends AuthGuard('jwt')
  implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    //Check if user is logged in
    const request = context.switchToHttp().getRequest();
    if (!request.isAuthenticated()) {
      return false;
    }

    return true;
  }
}
