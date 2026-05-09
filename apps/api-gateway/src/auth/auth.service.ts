import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@hospital/prisma';
import * as bcrypt from 'bcryptjs';
import { mailer } from '../mailer/mailer.service';
import { PasswordService } from './password.service';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    // check lockout
    if (user.lockUntil && user.lockUntil > new Date()) return { locked: true, lockUntil: user.lockUntil } as any;

    const match = await bcrypt.compare(pass, user.passwordHash);
    if (!match) {
      // increment failed attempts
      const attempts = (user.failedLoginAttempts || 0) + 1;
      const data: any = { failedLoginAttempts: attempts };
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        data.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
      }
      await this.prisma.user.update({ where: { id: user.id }, data });
      return null;
    }

    // reset failed attempts
    if (user.failedLoginAttempts && user.failedLoginAttempts > 0) {
      await this.prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockUntil: null } });
    }

    return user;
  }

  async login(user: any) {
    if (user.mfaEnabled) {
      const payload = { sub: user.id, email: user.email, mfaRequired: true };
      const mfaToken = this.jwt.sign(payload, { expiresIn: '5m' });
      return { mfaToken, requiresMfa: true, method: user.mfaMethod };
    }
    return this.generateAuthTokens(user);
  }

  async completeMfaLogin(user: any) {
    return this.generateAuthTokens(user);
  }

  async verifyMfaLogin(mfaToken: string, code: string, mfaService: any) {
    try {
      const payload = this.jwt.verify(mfaToken);
      if (!payload.mfaRequired) throw new UnauthorizedException('Invalid token');
      
      const isValid = await mfaService.verifyTotp(payload.sub, code);
      if (!isValid) throw new UnauthorizedException('Invalid MFA code');
      
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');
      
      return this.completeMfaLogin(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired MFA token');
    }
  }

  private async generateAuthTokens(user: any) {
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

  async register(dto: { email: string; password: string; firstName: string; lastName: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');
    // enforce password strength
    PasswordService.validateStrength(dto.password, [dto.email, dto.firstName, dto.lastName]);
    const passwordHash = await bcrypt.hash(dto.password, 12);
    // default role: PATIENT
    const role = await this.prisma.role.findUnique({ where: { name: 'PATIENT' } });
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, roleId: role ? role.id : undefined },
    });
    // create patient record
    await this.prisma.patient.create({
      data: { userId: user.id, hospitalId: (await this.prisma.hospital.findFirst())?.id || '', medicalRecordNumber: `MRN-${Date.now()}`, firstName: dto.firstName, lastName: dto.lastName },
    }).catch(() => {});
    return { id: user.id, email: user.email };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { ok: true }; // don't reveal
    const token = require('crypto').randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: token, passwordResetExpires: expires } });
    // send email
    const resetUrl = `${process.env.FRONTEND_URL || 'https://app.hospital.local'}/auth/reset-password?token=${token}`;
    await mailer.sendMail({ to: user.email, subject: 'Password reset', text: `Use this link to reset your password: ${resetUrl}` });
    return { ok: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({ where: { passwordResetToken: token } });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) throw new BadRequestException('Invalid or expired token');
    // enforce password strength
    PasswordService.validateStrength(newPassword, [user.email]);
    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash, passwordResetToken: null, passwordResetExpires: null, failedLoginAttempts: 0, lockUntil: null } });
    return { ok: true };
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
