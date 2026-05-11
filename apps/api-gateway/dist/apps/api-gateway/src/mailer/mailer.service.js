"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailerService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_SMTP_HOST,
            port: Number(process.env.EMAIL_SMTP_PORT || 587),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async sendMail(opts) {
        const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@hospital.local';
        return this.transporter.sendMail({ from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html });
    }
}
exports.mailer = new MailerService();
//# sourceMappingURL=mailer.service.js.map