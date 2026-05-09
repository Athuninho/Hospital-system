import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class MfaService {
  constructor(private prisma: PrismaService) {}

  async generateTotpSecret(userId: string, email: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, 'MombasaHospital', secret);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    });

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);
    return { secret, qrCodeDataUrl };
  }

  async verifyAndEnableTotp(userId: string, token: string) {
    return this.verifyAndEnable(userId, token, 'TOTP');
  }

  async setupSms(userId: string, phone: string) {
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret, mfaPhone: phone },
    });
    
    const token = authenticator.generate(secret);
    console.log(`[MOCK SMS] To ${phone}: Your verification code is ${token}`);
    
    return { ok: true, message: 'SMS verification code sent' };
  }

  async verifyAndEnableSms(userId: string, token: string) {
    return this.verifyAndEnable(userId, token, 'SMS');
  }

  private async verifyAndEnable(userId: string, token: string, method: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) {
      throw new BadRequestException(`${method} setup not initiated`);
    }

    const isValid = authenticator.verify({ token, secret: user.mfaSecret });
    if (!isValid) {
      throw new BadRequestException(`Invalid ${method} token`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true, mfaMethod: method },
    });

    return { ok: true, message: `${method} MFA enabled successfully` };
  }

  async verifyTotp(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret || !user.mfaEnabled) {
      return false;
    }

    return authenticator.verify({ token, secret: user.mfaSecret });
  }

  async sendLoginSms(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user && user.mfaEnabled && user.mfaMethod === 'SMS' && user.mfaSecret && user.mfaPhone) {
      const token = authenticator.generate(user.mfaSecret);
      console.log(`[MOCK SMS] To ${user.mfaPhone}: Your login code is ${token}`);
    }
  }
}
