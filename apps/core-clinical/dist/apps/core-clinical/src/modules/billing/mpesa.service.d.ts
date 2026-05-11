export declare class MpesaService {
    private readonly logger;
    private readonly consumerKey;
    private readonly consumerSecret;
    private readonly shortCode;
    private readonly passkey;
    private readonly callbackUrl;
    getAccessToken(): Promise<string>;
    initiateStkPush(phone: string, amount: number, reference: string): Promise<any>;
}
