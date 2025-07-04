import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JWTPayload } from '../../lib/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user: JWTPayload = request['jwtPayload'];

        if (!user?.roles?.some((role: string) => requiredRoles.includes(role))) {
            throw new ForbiddenException('You do not have permission to access this route');
        }

        return true;
    }
}