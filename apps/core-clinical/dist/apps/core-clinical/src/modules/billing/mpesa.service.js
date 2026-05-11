"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MpesaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpesaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let MpesaService = MpesaService_1 = class MpesaService {
    constructor() {
        this.logger = new common_1.Logger(MpesaService_1.name);
        // In production, these would be in .env
        this.consumerKey = process.env.MPESA_CONSUMER_KEY || 'your_key';
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'your_secret';
        this.shortCode = process.env.MPESA_SHORTCODE || '174379';
        this.passkey = process.env.MPESA_PASSKEY || 'your_passkey';
        this.callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/v1/billing/payments/mpesa/webhook';
    }
    async getAccessToken() {
        const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
        try {
            const response = await axios_1.default.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
                headers: { Authorization: `Basic ${auth}` },
            });
            return response.data.access_token;
        }
        catch (error) {
            this.logger.error('Failed to get M-Pesa access token', error.response?.data || error.message);
            throw new Error('M-Pesa Authentication Failed');
        }
    }
    async initiateStkPush(phone, amount, reference) {
        const token = await this.getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString('base64');
        const payload = {
            BusinessShortCode: this.shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: phone,
            PartyB: this.shortCode,
            PhoneNumber: phone,
            CallBackURL: this.callbackUrl,
            AccountReference: reference,
            TransactionDesc: `Payment for Invoice ${reference}`,
        };
        try {
            const response = await axios_1.default.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('STK Push Initiation Failed', error.response?.data || error.message);
            throw new Error('STK Push Initiation Failed');
        }
    }
};
exports.MpesaService = MpesaService;
exports.MpesaService = MpesaService = MpesaService_1 = __decorate([
    (0, common_1.Injectable)()
], MpesaService);
//# sourceMappingURL=mpesa.service.js.map