import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Salvar sessão no Redis
    await this.redisService.set(
      `session:${user.id}:${accessToken}`,
      JSON.stringify({ userId: user.id, createdAt: new Date() }),
      3600 // 1 hora
    );

    // Salvar refresh token no banco
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });

    // Atualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles.map((ur: any) => ({
          name: ur.role.name,
          slug: ur.role.slug,
          permissions: ur.role.permissions.map((rp: any) => ({
            resource: rp.permission.resource,
            action: rp.permission.action,
          })),
        })),
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const session = await this.prisma.session.findFirst({
        where: {
          userId: payload.sub,
          refreshToken,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!session) {
        throw new UnauthorizedException('Sessão inválida');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.active) {
        throw new UnauthorizedException('Usuário inválido');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        username: user.username,
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      // Atualizar sessão
      await this.prisma.session.update({
        where: { id: session.id },
        data: { token: newAccessToken },
      });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async logout(userId: string, token: string) {
    await this.redisService.del(`session:${userId}:${token}`);
    await this.prisma.session.deleteMany({
      where: {
        userId,
        token,
      },
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const sessionExists = await this.redisService.exists(`session:${payload.sub}:${token}`);

      if (!sessionExists) {
        throw new UnauthorizedException('Sessão expirada');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return false;
    }

    // SuperAdmin tem todas as permissões
    if (user.roles.some((ur) => ur.role.slug === 'super-admin')) {
      return true;
    }

    // Verificar permissões específicas
    return user.roles.some((ur) =>
      ur.role.permissions.some(
        (rp) =>
          rp.permission.resource === resource &&
          rp.permission.action === action
      )
    );
  }
}
