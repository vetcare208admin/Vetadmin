import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: No user found');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, branchId: true },
    });

    if (!dbUser || !requiredRoles.includes(dbUser.role as UserRole)) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    // Multi-tenant isolation: check branch access
    if (user.branchId && dbUser.branchId && user.branchId !== dbUser.branchId) {
      throw new ForbiddenException('Access denied: Cross-branch access not allowed');
    }

    return true;
  }
}
