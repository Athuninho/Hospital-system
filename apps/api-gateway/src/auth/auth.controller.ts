import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private mfaService: MfaService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    if (!user) throw new Error('Invalid credentials');
    if ((user as any).locked) throw new Error(`Account locked until ${(user as any).lockUntil}`);
    
    const result = await this.auth.login(user);
    if (result.requiresMfa && result.method === 'SMS') {
      await this.mfaService.sendLoginSms((user as any).id);
    }
    return result;
  }

  @Post('login/mfa')
  async verifyMfaLogin(@Body('mfaToken') mfaToken: string, @Body('code') code: string) {
    return this.auth.verifyMfaLogin(mfaToken, code, this.mfaService);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  async setupMfa(@Req() req: any) {
    return this.mfaService.generateTotpSecret(req.user.sub, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/enable')
  async enableMfa(@Req() req: any, @Body('token') token: string) {
    return this.mfaService.verifyAndEnableTotp(req.user.sub, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/sms/setup')
  async setupSmsMfa(@Req() req: any, @Body('phone') phone: string) {
    return this.mfaService.setupSms(req.user.sub, phone);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/sms/enable')
  async enableSmsMfa(@Req() req: any, @Body('token') token: string) {
    return this.mfaService.verifyAndEnableSms(req.user.sub, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: any) {
    const { refreshToken } = req.body;
    return this.auth.refresh(refreshToken);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto as any);
  }

  @Post('password/request')
  async requestReset(@Body() dto: RequestResetDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Post('password/reset')
  async reset(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }
}
