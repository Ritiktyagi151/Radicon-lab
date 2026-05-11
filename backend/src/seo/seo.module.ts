import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { SeoSettings, SeoSettingsSchema } from './schemas/seo-settings.schema';
import { SeoController } from './seo.controller';
import { SeoPublicController } from './seo-public.controller';
import { SeoService } from './seo.service';

@Module({
  imports: [
    AuthModule,
    RealtimeModule,
    MongooseModule.forFeature([{ name: SeoSettings.name, schema: SeoSettingsSchema }]),
  ],
  controllers: [SeoController, SeoPublicController],
  providers: [SeoService],
})
export class SeoModule {}
