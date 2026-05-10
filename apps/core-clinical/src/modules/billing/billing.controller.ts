import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('invoices')
  createInvoice(@Body() data: any) {
    return this.billingService.createInvoice(data);
  }

  @Get('invoices')
  getInvoices(@Query('patientId') patientId?: string) {
    return this.billingService.getInvoices(patientId);
  }

  @Post('payments/mpesa/stkpush')
  stkPush(@Body() data: { invoiceId: string; phone: string }) {
    return this.billingService.initiateMpesaSTKPush(data.invoiceId, data.phone);
  }

  @Post('payments/mpesa/webhook')
  webhook(@Body() payload: any) {
    return this.billingService.handleMpesaWebhook(payload);
  }
}
