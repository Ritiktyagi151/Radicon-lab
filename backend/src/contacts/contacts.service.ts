import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import nodemailer from 'nodemailer';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly hrTransporter: nodemailer.Transporter | null;
  private readonly mailFrom: string;
  private readonly hrMailFrom: string;
  private readonly hrMailTo: string;
  private readonly infoMailTo: string;

  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<ContactDocument>,
    private readonly realtimeService: RealtimeService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const hrUser = this.configService.get<string>('SMTP_HR_USER');
    const hrPass = this.configService.get<string>('SMTP_HR_PASS');

    this.mailFrom = this.configService.get<string>('SMTP_FROM') || user || '';
    this.hrMailFrom =
      this.configService.get<string>('SMTP_HR_FROM') || hrUser || this.mailFrom;
    this.hrMailTo = this.configService.get<string>('SMTP_TO_HR') || user || '';
    this.infoMailTo = this.configService.get<string>('SMTP_TO_INFO') || this.configService.get<string>('SMTP_TO') || user || '';

    this.transporter =
      host && user && pass
        ? nodemailer.createTransport({
            host,
            port: Number(this.configService.get<string>('SMTP_PORT') || 465),
            secure: this.configService.get<string>('SMTP_SECURE') !== 'false',
            auth: {
              user,
              pass,
            },
            tls: {
              rejectUnauthorized: this.configService.get<string>('SMTP_TLS_REJECT_UNAUTHORIZED') !== 'false',
            },
          })
        : null;

    this.hrTransporter =
      host && hrUser && hrPass
        ? nodemailer.createTransport({
            host,
            port: Number(this.configService.get<string>('SMTP_PORT') || 465),
            secure: this.configService.get<string>('SMTP_SECURE') !== 'false',
            auth: {
              user: hrUser,
              pass: hrPass,
            },
            tls: {
              rejectUnauthorized: this.configService.get<string>('SMTP_TLS_REJECT_UNAUTHORIZED') !== 'false',
            },
          })
        : this.transporter;
  }

  async create(createContactDto: CreateContactDto) {
    const contact = await this.contactModel.create(createContactDto);
    this.realtimeService.publish('contacts', 'created', `New inquiry from ${contact.name}`);
    void this.sendContactEmails(contact).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown mail error';
      this.logger.error(`Unable to send contact emails: ${message}`);
    });
    return contact;
  }

  findAll() {
    return this.contactModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async remove(id: string) {
    const contact = await this.contactModel.findByIdAndDelete(id).lean().exec();

    if (!contact) throw new NotFoundException('Contact inquiry not found');

    this.realtimeService.publish('contacts', 'deleted', `Inquiry deleted: ${contact.subject}`);

    return { message: 'Contact inquiry deleted successfully' };
  }

  private async sendContactEmails(contact: ContactDocument) {
    const mailTo = this.getNotificationRecipient(contact);
    const transporter = this.getTransporter(contact);
    const mailFrom = this.getMailFrom(contact);

    if (!transporter || !mailFrom || !mailTo) {
      this.logger.warn('SMTP is not configured; contact notification email skipped.');
      return;
    }

    await this.sendAdminNotification(contact, mailTo, transporter, mailFrom);
    await this.sendSenderConfirmation(contact, transporter, mailFrom);
  }

  private async sendAdminNotification(
    contact: ContactDocument,
    mailTo: string,
    transporter: nodemailer.Transporter,
    mailFrom: string,
  ) {
    const subject = `${this.isCareerInquiry(contact) ? 'Radicon Career Application' : 'Radicon Website Inquiry'}: ${contact.subject}`;
    const text = [
      'New inquiry received from Radicon website.',
      '',
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone || 'Not provided'}`,
      `Company: ${contact.company || 'Not provided'}`,
      `Subject: ${contact.subject}`,
      '',
      'Message:',
      contact.message,
    ].join('\n');

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: contact.email,
      subject,
      text,
      html: this.buildContactEmailHtml(contact),
    });
  }

  private async sendSenderConfirmation(
    contact: ContactDocument,
    transporter: nodemailer.Transporter,
    mailFrom: string,
  ) {
    const isCareerInquiry = this.isCareerInquiry(contact);
    const subject = isCareerInquiry
      ? 'Thank you for applying to Radicon Laboratories'
      : 'Thank you for contacting Radicon Laboratories';
    const message = isCareerInquiry
      ? 'Thank you for applying to Radicon Laboratories. Our HR team has received your details and will review your application. If you have not already shared your resume, please send it to garima_hr@radiconlab.com.'
      : 'Thank you for contacting Radicon Laboratories. Our team has received your inquiry and will get back to you shortly.';

    await transporter.sendMail({
      from: mailFrom,
      to: contact.email,
      subject,
      text: [
        `Dear ${contact.name},`,
        '',
        message,
        '',
        'Submitted details:',
        `Subject: ${contact.subject}`,
        `Message: ${contact.message}`,
        '',
        'Regards,',
        'Radicon Laboratories',
      ].join('\n'),
      html: this.buildSenderConfirmationHtml(contact, message),
    });
  }

  private getNotificationRecipient(contact: ContactDocument) {
    return this.isCareerInquiry(contact) ? this.hrMailTo : this.infoMailTo;
  }

  private getTransporter(contact: ContactDocument) {
    return this.isCareerInquiry(contact) ? this.hrTransporter : this.transporter;
  }

  private getMailFrom(contact: ContactDocument) {
    return this.isCareerInquiry(contact) ? this.hrMailFrom : this.mailFrom;
  }

  private isCareerInquiry(contact: ContactDocument) {
    return `${contact.subject} ${contact.company || ''}`.toLowerCase().includes('career');
  }

  private buildContactEmailHtml(contact: ContactDocument) {
    const fields = [
      ['Name', contact.name],
      ['Email', contact.email],
      ['Phone', contact.phone || 'Not provided'],
      ['Company', contact.company || 'Not provided'],
      ['Subject', contact.subject],
    ];

    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 16px;">New Radicon website inquiry</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          ${fields
            .map(
              ([label, value]) => `
                <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 8px 12px; font-weight: 700; width: 140px;">${this.escapeHtml(label)}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 8px 12px;">${this.escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join('')}
        </table>
        <h3 style="margin: 20px 0 8px;">Message</h3>
        <div style="white-space: pre-wrap; border: 1px solid #e5e7eb; padding: 12px; max-width: 640px;">${this.escapeHtml(contact.message)}</div>
      </div>
    `;
  }

  private buildSenderConfirmationHtml(contact: ContactDocument, message: string) {
    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 16px;">Thank you, ${this.escapeHtml(contact.name)}</h2>
        <p>${this.escapeHtml(message)}</p>
        <h3 style="margin: 20px 0 8px;">Your submitted details</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 8px 12px; font-weight: 700; width: 140px;">Subject</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px 12px;">${this.escapeHtml(contact.subject)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 8px 12px; font-weight: 700; width: 140px;">Message</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px 12px; white-space: pre-wrap;">${this.escapeHtml(contact.message)}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Regards,<br />Radicon Laboratories</p>
      </div>
    `;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
