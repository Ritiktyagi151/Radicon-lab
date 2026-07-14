import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type RecaptchaResponse = {
  success?: boolean;
  'error-codes'?: string[];
};

@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);

  constructor(private readonly configService: ConfigService) {}

  async verify(token: string | undefined) {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');

    if (!secretKey) {
      this.logger.error('RECAPTCHA_SECRET_KEY is not configured.');
      throw new ServiceUnavailableException('reCAPTCHA is not configured.');
    }

    if (!token) {
      throw new BadRequestException('reCAPTCHA verification is required.');
    }

    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      this.logger.error(`reCAPTCHA verification request failed with status ${response.status}.`);
      throw new ServiceUnavailableException('Unable to verify reCAPTCHA right now.');
    }

    const payload = (await response.json()) as RecaptchaResponse;

    if (!payload.success) {
      this.logger.warn(
        `Blocked contact submission by reCAPTCHA. errors=${payload['error-codes']?.join(',') || 'none'}`,
      );
      throw new BadRequestException('reCAPTCHA verification failed.');
    }
  }
}
