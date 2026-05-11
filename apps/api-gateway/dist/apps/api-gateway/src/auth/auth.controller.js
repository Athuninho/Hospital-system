"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const mfa_service_1 = require("./mfa.service");
const login_dto_1 = require("./dto/login.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const register_dto_1 = require("./dto/register.dto");
const request_reset_dto_1 = require("./dto/request-reset.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
let AuthController = class AuthController {
    constructor(auth, mfaService) {
        this.auth = auth;
        this.mfaService = mfaService;
    }
    async login(dto) {
        const user = await this.auth.validateUser(dto.email, dto.password);
        if (!user)
            throw new Error('Invalid credentials');
        if (user.locked)
            throw new Error(`Account locked until ${user.lockUntil}`);
        const result = await this.auth.login(user);
        if (typeof result === 'object' && 'requiresMfa' in result && result.requiresMfa && result.method === 'SMS') {
            await this.mfaService.sendLoginSms(user.id);
        }
        return result;
    }
    async verifyMfaLogin(mfaToken, code) {
        return this.auth.verifyMfaLogin(mfaToken, code, this.mfaService);
    }
    async setupMfa(req) {
        return this.mfaService.generateTotpSecret(req.user.sub, req.user.email);
    }
    async enableMfa(req, token) {
        return this.mfaService.verifyAndEnableTotp(req.user.sub, token);
    }
    async setupSmsMfa(req, phone) {
        return this.mfaService.setupSms(req.user.sub, phone);
    }
    async enableSmsMfa(req, token) {
        return this.mfaService.verifyAndEnableSms(req.user.sub, token);
    }
    async refresh(req) {
        const { refreshToken } = req.body;
        return this.auth.refresh(refreshToken);
    }
    async register(dto) {
        return this.auth.register(dto);
    }
    async requestReset(dto) {
        return this.auth.requestPasswordReset(dto.email);
    }
    async reset(dto) {
        return this.auth.resetPassword(dto.token, dto.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login/mfa'),
    __param(0, (0, common_1.Body)('mfaToken')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfaLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/setup'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setupMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/enable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/sms/setup'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setupSmsMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/sms/enable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableSmsMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('password/request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_reset_dto_1.RequestResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestReset", null);
__decorate([
    (0, common_1.Post)('password/reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reset", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, mfa_service_1.MfaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map