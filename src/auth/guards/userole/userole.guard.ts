import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { use } from 'passport';
import { Observable, retry } from 'rxjs';
import { META_ROLES } from 'src/auth/decorator/role-protected/role-protected.decorator';

@Injectable()
export class UseroleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles: String[] = this.reflector.get(META_ROLES, context.getHandler())
    // console.log(roles);

    const req = context.switchToHttp().getRequest()
    const user = req.user;

    if (!roles) return true;
    if (roles.length === 0) return true;
    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (roles.includes(role)) {
        return true
      }
    }

    throw new ForbiddenException(`User ${user.fullname} need a valid role [${roles}]`)

  }
}
