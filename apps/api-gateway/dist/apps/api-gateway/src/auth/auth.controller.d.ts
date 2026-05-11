import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private auth;
    private mfaService;
    constructor(auth: AuthService, mfaService: MfaService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    } | {
        mfaToken: string;
        requiresMfa: boolean;
        method: any;
    }>;
    verifyMfaLogin(mfaToken: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    setupMfa(req: any): Promise<{
        secret: any;
        qrCodeDataUrl: any;
    }>;
    enableMfa(req: any, token: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    setupSmsMfa(req: any, phone: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    enableSmsMfa(req: any, token: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
    }>;
    requestReset(dto: RequestResetDto): Promise<{
        ok: boolean;
    }>;
    reset(dto: ResetPasswordDto): Promise<{
        ok: boolean;
    }>;
}
