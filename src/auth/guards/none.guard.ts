import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class NoneGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    return req.user === undefined;
  }
}