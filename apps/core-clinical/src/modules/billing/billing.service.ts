import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';
import { MpesaService } from './mpesa.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private prisma: PrismaService,
    private mpesa: MpesaService
  ) {}

  async createInvoice(data: {
    hospitalId: string;
    patientId: string;
    totalAmount: number;
  }) {
    return this.prisma.invoice.create({
      data: {
        hospitalId: data.hospitalId,
        patientId: data.patientId,
        totalAmount: data.totalAmount,
        status: 'PENDING',
      },
    });
  }

  async initiateMpesaSTKPush(invoiceId: string, phone: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) throw new Error('Invoice not found');

    // 1. Initiate STK Push via Safaricom
    const response = await this.mpesa.initiateStkPush(phone, invoice.totalAmount, invoiceId.slice(0, 8));

    // 2. Create a pending payment record with CheckoutRequestID
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

  async handleMpesaWebhook(payload: any) {
    const { Body } = payload;
    if (!Body || !Body.stkCallback) {
      this.logger.error('Invalid M-Pesa payload', payload);
      return;
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    // Find the payment record by CheckoutRequestID
    const payment = await this.prisma.payment.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!payment) {
      this.logger.error(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return;
    }

    if (ResultCode === 0) {
      // SUCCESS
      const metadata = CallbackMetadata.Item;
      const receiptNumber = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;

      await this.prisma.$transaction([
        // 1. Update Payment Status
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            mpesaReceiptNumber: receiptNumber,
          },
        }),
        // 2. Update Invoice Status
        this.prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: 'PAID' },
        }),
      ]);

      this.logger.log(`Payment SUCCESS for Invoice ${payment.invoiceId}. Receipt: ${receiptNumber}`);
    } else {
      // FAILED (or Cancelled)
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      this.logger.warn(`Payment FAILED for Invoice ${payment.invoiceId}. Reason: ${ResultDesc}`);
    }
  }
}

