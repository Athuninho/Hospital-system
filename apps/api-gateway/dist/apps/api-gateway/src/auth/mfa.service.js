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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@hospital/prisma");
const otplib_1 = require("otplib");
const qrcode = __importStar(require("qrcode"));
let MfaService = class MfaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateTotpSecret(userId, email) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(email, 'MombasaHospital', secret);
        await this.prisma.user.update({
            where: { id: userId },
            data: { mfaSecret: secret },
        });
        const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);
        return { secret, qrCodeDataUrl };
    }
    async verifyAndEnableTotp(userId, token) {
        return this.verifyAndEnable(userId, token, 'TOTP');
    }
    async setupSms(userId, phone) {
        const secret = otplib_1.authenticator.generateSecret();
        await this.prisma.user.update({
            where: { id: userId },
            data: { mfaSecret: secret, mfaPhone: phone },
        });
        const token = otplib_1.authenticator.generate(secret);
        console.log(`[MOCK SMS] To ${phone}: Your verification code is ${token}`);
        return { ok: true, message: 'SMS verification code sent' };
    }
    async verifyAndEnableSms(userId, token) {
        return this.verifyAndEnable(userId, token, 'SMS');
    }
    async verifyAndEnable(userId, token, method) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.mfaSecret) {
            throw new common_1.BadRequestException(`${method} setup not initiated`);
        }
        const isValid = otplib_1.authenticator.verify({ token, secret: user.mfaSecret });
        if (!isValid) {
            throw new common_1.BadRequestException(`Invalid ${method} token`);
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { mfaEnabled: true, mfaMethod: method },
        });
        return { ok: true, message: `${method} MFA enabled successfully` };
    }
    async verifyTotp(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.mfaSecret || !user.mfaEnabled) {
            return false;
        }
        return otplib_1.authenticator.verify({ token, secret: user.mfaSecret });
    }
    async sendLoginSms(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.mfaEnabled && user.mfaMethod === 'SMS' && user.mfaSecret && user.mfaPhone) {
            const token = otplib_1.authenticator.generate(user.mfaSecret);
            console.log(`[MOCK SMS] To ${user.mfaPhone}: Your login code is ${token}`);
        }
    }
};
exports.MfaService = MfaService;
exports.MfaService = MfaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], MfaService);
//# sourceMappingURL=mfa.service.js.map