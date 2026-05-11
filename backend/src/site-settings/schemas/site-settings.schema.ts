import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteSettingsDocument = HydratedDocument<SiteSettings>;

@Schema({ timestamps: true })
export class SiteSettings {
  @Prop({ default: 'default', unique: true })
  key: string;

  @Prop({
    type: [
      {
        label: String,
        href: String,
      },
    ],
    default: [],
  })
  navLinks: Array<{ label: string; href: string }>;

  @Prop({
    type: {
      facebook: String,
      instagram: String,
      linkedin: String,
      youtube: String,
      x: String,
    },
    default: {},
  })
  socialLinks: Record<string, string>;

  @Prop({ default: 'Copyright Radicon Lab. All rights reserved.' })
  copyrightText: string;

  @Prop({ default: '1.0.0' })
  version: string;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
