import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);

  // In production, these would be in .env
  private readonly consumerKey = process.env.MPESA_CONSUMER_KEY || 'your_key';
  private readonly consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'your_secret';
  private readonly shortCode = process.env.MPESA_SHORTCODE || '174379';
  private readonly passkey = process.env.MPESA_PASSKEY || 'your_passkey';
  private readonly callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/v1/billing/payments/mpesa/webhook';

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: { Authorization: `Basic ${auth}` },
        }
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get M-Pesa access token', error.response?.data || error.message);
      throw new Error('M-Pesa Authentication Failed');
    }
  }

  async initiateStkPush(phone: string, amount: number, reference: string): Promise<any> {
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
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error('STK Push Initiation Failed', error.response?.data || error.message);
      throw new Error('STK Push Initiation Failed');
    }
  }
}
