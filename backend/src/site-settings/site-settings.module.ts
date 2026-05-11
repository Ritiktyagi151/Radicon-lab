import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { SiteSettings, SiteSettingsSchema } from './schemas/site-settings.schema';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
  imports: [
    AuthModule,
    RealtimeModule,
    MongooseModule.forFeature([{ name: SiteSettings.name, schema: SiteSettingsSchema }]),
  ],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
