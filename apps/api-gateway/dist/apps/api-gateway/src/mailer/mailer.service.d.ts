declare class MailerService {
    private transporter;
    constructor();
    sendMail(opts: {
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }): Promise<any>;
}
export declare const mailer: MailerService;
export {};
