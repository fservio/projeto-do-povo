import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<{ resource: string; action: string }[]>(
      'permissions',
      context.getHandler()
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    for (const permission of requiredPermissions) {
      const hasPermission = await this.authService.checkPermission(
        user.userId,
        permission.resource,
        permission.action
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Você não tem permissão para ${permission.action} ${permission.resource}`
        );
      }
    }

    return true;
  }
}
