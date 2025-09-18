import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.verify(token);

    if (!requiredRoles.includes(payload.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    request.user = payload;
    return true;
  }
}
