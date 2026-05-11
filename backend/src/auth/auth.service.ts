import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';

type TokenPayload = {
  email: string;
  role: 'admin';
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  login(email: string, password: string) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@radiconlab.com';
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin12345';

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: TokenPayload = {
      email,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    };

    return {
      token: this.sign(payload),
      user: {
        email,
        role: 'admin',
      },
    };
  }

  verify(token: string): TokenPayload {
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const expectedSignature = this.createSignature(encodedPayload);
    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      throw new UnauthorizedException('Invalid token signature');
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()) as TokenPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired');
    }

    return payload;
  }

  private sign(payload: TokenPayload) {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${encodedPayload}.${this.createSignature(encodedPayload)}`;
  }

  private createSignature(encodedPayload: string) {
    const secret = this.configService.get<string>('AUTH_SECRET') || 'radicon-development-secret';
    return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  }
}
