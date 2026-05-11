import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@hospital/prisma';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: any;
        refreshToken: string;
    } | {
        mfaToken: any;
        requiresMfa: boolean;
        method: any;
    }>;
    completeMfaLogin(user: any): Promise<{
        accessToken: any;
        refreshToken: string;
    }>;
    verifyMfaLogin(mfaToken: string, code: string, mfaService: any): Promise<{
        accessToken: any;
        refreshToken: string;
    }>;
    private generateAuthTokens;
    register(dto: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<{
        id: string;
        email: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        ok: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        ok: boolean;
    }>;
    private generateRefreshToken;
    refresh(token: string): Promise<{
        accessToken: any;
    }>;
}
