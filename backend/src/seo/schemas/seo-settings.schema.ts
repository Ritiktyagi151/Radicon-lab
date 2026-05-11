import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SeoSettingsDocument = HydratedDocument<SeoSettings>;

@Schema({ _id: false })
export class SeoPage {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  pageName: string;

  @Prop({ required: true })
  pageType: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: '' })
  customSlug: string;

  @Prop({ default: '' })
  canonicalUrl: string;

  @Prop({ default: 'self' })
  canonicalMode: 'self' | 'custom';

  @Prop({ default: '' })
  metaTitle: string;

  @Prop({ default: '' })
  metaDescription: string;

  @Prop({ default: '' })
  focusKeyword: string;

  @Prop({ type: Object, default: {} })
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
  };

  @Prop({ type: Object, default: {} })
  twitter: {
    title?: string;
    description?: string;
    image?: string;
  };

  @Prop({ default: 'index' })
  robotsIndex: 'index' | 'noindex';

  @Prop({ default: 'follow' })
  robotsFollow: 'follow' | 'nofollow';

  @Prop({ default: true })
  includeInSitemap: boolean;

  @Prop({ default: '' })
  schemaType: string;

  @Prop({ default: '' })
  schemaJson: string;
}

@Schema({ _id: false })
export class SeoRedirect {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  oldUrl: string;

  @Prop({ required: true })
  newUrl: string;

  @Prop({ default: 301 })
  type: 301 | 302;
}

@Schema({ timestamps: true })
export class SeoSettings {
  @Prop({ default: 'default', unique: true })
  key: string;

  @Prop({ type: [Object], default: [] })
  pages: SeoPage[];

  @Prop({ type: [Object], default: [] })
  redirects: SeoRedirect[];

  @Prop({ default: 'User-agent: *\nAllow: /\nSitemap: https://radiconlab.com/sitemap.xml' })
  robotsTxt: string;

  @Prop({
    type: Object,
    default: {
      metaTitleFormat: '{page} | Radicon Lab',
      defaultMetaDescription: 'Radicon Lab - Your trusted pharmaceutical manufacturing partner.',
      canonicalBehavior: 'self',
      googleAnalyticsId: '',
      googleSearchConsoleCode: '',
      faviconUrl: '/favicon.ico',
      siteUrl: 'https://radiconlab.com',
    },
  })
  global: {
    metaTitleFormat: string;
    defaultMetaDescription: string;
    canonicalBehavior: 'self' | 'manual';
    googleAnalyticsId: string;
    googleSearchConsoleCode: string;
    faviconUrl: string;
    siteUrl: string;
  };

  @Prop({ default: '' })
  sitemapXml: string;

  @Prop()
  sitemapGeneratedAt?: Date;
}

export const SeoSettingsSchema = SchemaFactory.createForClass(SeoSettings);
