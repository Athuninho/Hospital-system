import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@hospital/prisma';
import { MfaService } from './mfa.service';

config();

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_this_in_production',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' } as any,
    }),
  ],
  providers: [AuthService, MfaService],
  controllers: [AuthController],
  exports: [AuthService, MfaService],
})
export class AuthModule {}
