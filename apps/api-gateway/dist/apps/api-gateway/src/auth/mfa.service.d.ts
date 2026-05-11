import { PrismaService } from '@hospital/prisma';
export declare class MfaService {
    private prisma;
    constructor(prisma: PrismaService);
    generateTotpSecret(userId: string, email: string): Promise<{
        secret: string;
        qrCodeDataUrl: any;
    }>;
    verifyAndEnableTotp(userId: string, token: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    setupSms(userId: string, phone: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    verifyAndEnableSms(userId: string, token: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    private verifyAndEnable;
    verifyTotp(userId: string, token: string): Promise<boolean>;
    sendLoginSms(userId: string): Promise<void>;
}
