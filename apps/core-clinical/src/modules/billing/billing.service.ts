import { Injectable } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

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

  async getInvoices(patientId?: string) {
    return this.prisma.invoice.findMany({
      where: patientId ? { patientId } : {},
      include: {
        patient: true,
        payments: true,
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async initiateMpesaSTKPush(invoiceId: string, phone: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) throw new Error('Invoice not found');

    // M-Pesa STK Push Logic (Mock for now, would use Daraja API)
    console.log(`Initiating STK Push for ${phone} - Amount: ${invoice.totalAmount}`);
    
    // In a real app, you'd call axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', ...)
    
    // We create a pending payment record
    return this.prisma.payment.create({
      data: {
        invoiceId,
        amount: invoice.totalAmount,
        method: 'MPESA',
        status: 'PENDING',
        transactionRef: `MPESA_${Math.random().toString(36).substring(7).toUpperCase()}`,
      },
    });
  }

  async handleMpesaWebhook(payload: any) {
    // Handle M-Pesa Result
    const { Body } = payload;
    const { stkCallback } = Body;
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    if (ResultCode === 0) {
      // Payment Successful
      // Update payment and invoice status
      // In a real app, find payment by CheckoutRequestID (stored when initiated)
      // For now, let's assume we have the transaction ref
    }
  }
}
