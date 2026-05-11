"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_1 = require("@hospital/prisma");
const bcrypt = __importStar(require("bcryptjs"));
const mailer_service_1 = require("../mailer/mailer.service");
const password_service_1 = require("./password.service");
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async validateUser(email, pass) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        // check lockout
        if (user.lockUntil && user.lockUntil > new Date())
            return { locked: true, lockUntil: user.lockUntil };
        const match = await bcrypt.compare(pass, user.passwordHash);
        if (!match) {
            // increment failed attempts
            const attempts = (user.failedLoginAttempts || 0) + 1;
            const data = { failedLoginAttempts: attempts };
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
    async login(user) {
        if (user.mfaEnabled) {
            const payload = { sub: user.id, email: user.email, mfaRequired: true };
            const mfaToken = this.jwt.sign(payload, { expiresIn: '5m' });
            return { mfaToken, requiresMfa: true, method: user.mfaMethod };
        }
        return this.generateAuthTokens(user);
    }
    async completeMfaLogin(user) {
        return this.generateAuthTokens(user);
    }
    async verifyMfaLogin(mfaToken, code, mfaService) {
        try {
            const payload = this.jwt.verify(mfaToken);
            if (!payload.mfaRequired)
                throw new common_1.UnauthorizedException('Invalid token');
            const isValid = await mfaService.verifyTotp(payload.sub, code);
            if (!isValid)
                throw new common_1.UnauthorizedException('Invalid MFA code');
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            return this.completeMfaLogin(user);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired MFA token');
        }
    }
    async generateAuthTokens(user) {
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
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.BadRequestException('Email already registered');
        // enforce password strength
        password_service_1.PasswordService.validateStrength(dto.password, [dto.email, dto.firstName, dto.lastName]);
        const passwordHash = await bcrypt.hash(dto.password, 12);
        // default role: PATIENT — ensure role exists
        let role = await this.prisma.role.findUnique({ where: { name: 'PATIENT' } });
        if (!role) {
            role = await this.prisma.role.create({ data: { name: 'PATIENT', description: 'Default patient role' } });
        }
        const user = await this.prisma.user.create({
            data: { email: dto.email, passwordHash, roleId: role.id },
        });
        // create patient record
        await this.prisma.patient.create({
            data: { userId: user.id, hospitalId: (await this.prisma.hospital.findFirst())?.id || '', medicalRecordNumber: `MRN-${Date.now()}`, firstName: dto.firstName, lastName: dto.lastName },
        }).catch(() => { });
        return { id: user.id, email: user.email };
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { ok: true }; // don't reveal
        const token = require('crypto').randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await this.prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: token, passwordResetExpires: expires } });
        // send email
        const resetUrl = `${process.env.FRONTEND_URL || 'https://app.hospital.local'}/auth/reset-password?token=${token}`;
        await mailer_service_1.mailer.sendMail({ to: user.email, subject: 'Password reset', text: `Use this link to reset your password: ${resetUrl}` });
        return { ok: true };
    }
    async resetPassword(token, newPassword) {
        const user = await this.prisma.user.findFirst({ where: { passwordResetToken: token } });
        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date())
            throw new common_1.BadRequestException('Invalid or expired token');
        // enforce password strength
        password_service_1.PasswordService.validateStrength(newPassword, [user.email]);
        const hash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash, passwordResetToken: null, passwordResetExpires: null, failedLoginAttempts: 0, lockUntil: null } });
        return { ok: true };
    }
    generateRefreshToken() {
        return require('crypto').randomBytes(48).toString('hex');
    }
    async refresh(token) {
        const rt = await this.prisma.refreshToken.findUnique({ where: { token } });
        if (!rt || rt.revoked || rt.expiresAt < new Date())
            throw new common_1.UnauthorizedException();
        const user = await this.prisma.user.findUnique({ where: { id: rt.userId } });
        if (!user)
            throw new common_1.UnauthorizedException();
        const payload = { sub: user.id, email: user.email, roleId: user.roleId };
        const accessToken = this.jwt.sign(payload);
        return { accessToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map