import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@hospital/prisma';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.passwordHash);
    if (!match) return null;
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    const accessToken = this.jwt.sign(payload);

    // create refresh token record
    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        token: this.generateRefreshToken(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken: refreshToken.token };
  }

  private generateRefreshToken() {
    return require('crypto').randomBytes(48).toString('hex');
  }

  async refresh(token: string) {
    const rt = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!rt || rt.revoked || rt.expiresAt < new Date()) throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({ where: { id: rt.userId } });
    if (!user) throw new UnauthorizedException();
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    const accessToken = this.jwt.sign(payload);
    return { accessToken };
  }
}
