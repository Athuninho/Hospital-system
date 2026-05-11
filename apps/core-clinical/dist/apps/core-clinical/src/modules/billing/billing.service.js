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
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@hospital/prisma");
const mpesa_service_1 = require("./mpesa.service");
let BillingService = BillingService_1 = class BillingService {
    constructor(prisma, mpesa) {
        this.prisma = prisma;
        this.mpesa = mpesa;
        this.logger = new common_1.Logger(BillingService_1.name);
    }
    async getInvoices(patientId) {
        return this.prisma.invoice.findMany({
            where: patientId ? { patientId } : {},
            include: { patient: true },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async createInvoice(data) {
        return this.prisma.invoice.create({
            data: {
                hospitalId: data.hospitalId,
                patientId: data.patientId,
                totalAmount: data.totalAmount,
                status: 'PENDING',
            },
        });
    }
    async initiateMpesaSTKPush(invoiceId, phone) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
        });
        if (!invoice)
            throw new Error('Invoice not found');
        const response = await this.mpesa.initiateStkPush(phone, invoice.totalAmount, invoiceId.slice(0, 8));
        return this.prisma.payment.create({
            data: {
                invoiceId,
                amount: invoice.totalAmount,
                method: 'MPESA',
                status: 'PENDING',
                checkoutRequestId: response.CheckoutRequestID,
                reference: `INV-${invoiceId.slice(0, 8)}`,
            },
        });
    }
    async handleMpesaWebhook(payload) {
        const { Body } = payload;
        if (!Body || !Body.stkCallback) {
            this.logger.error('Invalid M-Pesa payload', payload);
            return;
        }
        const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;
        const payment = await this.prisma.payment.findUnique({
            where: { checkoutRequestId: CheckoutRequestID },
        });
        if (!payment) {
            this.logger.error(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
            return;
        }
        if (ResultCode === 0) {
            const metadata = CallbackMetadata.Item;
            const receiptNumber = metadata.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
            await this.prisma.$transaction([
                this.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'PAID',
                        mpesaReceiptNumber: receiptNumber,
                    },
                }),
                this.prisma.invoice.update({
                    where: { id: payment.invoiceId },
                    data: { status: 'PAID' },
                }),
            ]);
            this.logger.log(`Payment SUCCESS for Invoice ${payment.invoiceId}. Receipt: ${receiptNumber}`);
        }
        else {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' },
            });
            this.logger.warn(`Payment FAILED for Invoice ${payment.invoiceId}. Reason: ${ResultDesc}`);
        }
    }
    async recordCashPayment(invoiceId, amount, reference) {
        return this.prisma.$transaction([
            this.prisma.payment.create({
                data: {
                    invoiceId,
                    amount,
                    method: 'CASH',
                    status: 'PAID',
                    reference: reference || `CASH-${Date.now()}`,
                },
            }),
            this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: 'PAID' },
            }),
        ]);
    }
    async recordBankPayment(invoiceId, amount, bankRef) {
        return this.prisma.$transaction([
            this.prisma.payment.create({
                data: {
                    invoiceId,
                    amount,
                    method: 'BANK_TRANSFER',
                    status: 'PAID',
                    reference: bankRef,
                },
            }),
            this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: 'PAID' },
            }),
        ]);
    }
};
BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        mpesa_service_1.MpesaService])
], BillingService);
exports.BillingService = BillingService;
