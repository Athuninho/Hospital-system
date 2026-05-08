import nodemailer from 'nodemailer';

class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: Number(process.env.EMAIL_SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(opts: { to: string; subject: string; text?: string; html?: string }) {
    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@hospital.local';
    return this.transporter.sendMail({ from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html });
  }
}

export const mailer = new MailerService();
