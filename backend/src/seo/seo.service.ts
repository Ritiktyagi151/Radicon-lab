import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { GlobalSeoDto, RedirectDto, SeoPageDto } from './dto/seo.dto';
import { RealtimeService } from '../realtime/realtime.service';
import { SeoSettings, SeoSettingsDocument } from './schemas/seo-settings.schema';

const defaultPages = [
  { pageName: 'Home', pageType: 'Website', url: '/', customSlug: '', schemaType: 'Website' },
  { pageName: 'About', pageType: 'WebPage', url: '/about', customSlug: '', schemaType: 'Breadcrumb' },
  { pageName: 'Services', pageType: 'Product', url: '/services', customSlug: '', schemaType: 'Product' },
  { pageName: 'Blogs', pageType: 'Article', url: '/blogs', customSlug: '', schemaType: 'Article' },
  { pageName: 'Contact', pageType: 'ContactPage', url: '/contact', customSlug: '', schemaType: 'Breadcrumb' },
];

const defaultGlobal = {
  metaTitleFormat: '{page} | Radicon Lab',
  defaultMetaDescription: 'Radicon Lab - Your trusted pharmaceutical manufacturing partner.',
  canonicalBehavior: 'self' as const,
  googleAnalyticsId: '',
  googleSearchConsoleCode: '',
  faviconUrl: '/favicon.ico',
  siteUrl: 'https://radiconlab.com',
};

type SeoGlobalSettings = typeof defaultGlobal & {
  canonicalBehavior: 'self' | 'manual';
};

export type PublicSeoRoute = {
  id: string;
  pageName: string;
  pageType: string;
  url: string;
  customSlug: string;
  path: string;
  canonicalUrl: string;
  canonicalMode: 'self' | 'custom';
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
  };
  twitter: {
    title?: string;
    description?: string;
    image?: string;
  };
  robotsIndex: 'index' | 'noindex';
  robotsFollow: 'follow' | 'nofollow';
  schemaType: string;
};

@Injectable()
export class SeoService {
  constructor(
    @InjectModel(SeoSettings.name)
    private readonly seoSettingsModel: Model<SeoSettingsDocument>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async getSettings() {
    const settings = await this.ensureSettings();
    const global = (settings.global || defaultGlobal) as SeoGlobalSettings;
    return {
      ...settings,
      analysis: settings.pages.map((page) => this.analyzePage(page, global)),
    };
  }

  async getPublicRoutes() {
    const settings = await this.ensureSettings();
    const global = (settings.global || defaultGlobal) as SeoGlobalSettings;

    return (settings.pages || []).map((page) => this.toPublicRoute(page, global));
  }

  async resolvePublicRoute(path: string) {
    const normalizedPath = this.normalizePath(path);
    const routes = await this.getPublicRoutes();

    return (
      routes.find((route) => route.path === normalizedPath || route.url === normalizedPath) ||
      null
    );
  }

  async savePage(pageDto: SeoPageDto) {
    const settings = await this.ensureSettings();
    const page = this.normalizePage(pageDto);
    const pages = settings.pages || [];
    const index = pages.findIndex((item) => item.id === page.id);

    if (index >= 0) pages[index] = page;
    else pages.unshift(page);

    const result = await this.seoSettingsModel
      .findOneAndUpdate({ key: 'default' }, { pages }, { new: true })
      .lean()
      .exec();
    this.realtimeService.publish('seo', 'updated', `SEO page saved: ${page.pageName}`);
    return result;
  }

  async deletePage(id: string) {
    const settings = await this.ensureSettings();
    const pages = (settings.pages || []).filter((page) => page.id !== id);
    const result = await this.seoSettingsModel.findOneAndUpdate({ key: 'default' }, { pages }, { new: true }).lean().exec();
    this.realtimeService.publish('seo', 'deleted', 'SEO page deleted');
    return result;
  }

  async saveRedirects(redirects: RedirectDto[]) {
    const normalized = redirects.map((redirect) => ({
      ...redirect,
      id: redirect.id || randomUUID(),
    }));
    const result = await this.seoSettingsModel
      .findOneAndUpdate({ key: 'default' }, { redirects: normalized }, { new: true, upsert: true })
      .lean()
      .exec();
    this.realtimeService.publish('seo', 'updated', 'SEO redirects updated');
    return result;
  }

  async saveRobots(robotsTxt: string) {
    const result = await this.seoSettingsModel
      .findOneAndUpdate({ key: 'default' }, { robotsTxt }, { new: true, upsert: true })
      .lean()
      .exec();
    this.realtimeService.publish('seo', 'updated', 'Robots.txt updated');
    return result;
  }

  async saveGlobal(global: GlobalSeoDto) {
    const result = await this.seoSettingsModel
      .findOneAndUpdate({ key: 'default' }, { global }, { new: true, upsert: true })
      .lean()
      .exec();
    this.realtimeService.publish('seo', 'updated', 'Global SEO settings updated');
    return result;
  }

  async regenerateSitemap() {
    const settings = await this.ensureSettings();
    const global = (settings.global || defaultGlobal) as SeoGlobalSettings;
    const siteUrl = global.siteUrl.replace(/\/$/, '');
    const urls = (settings.pages || [])
      .filter((page) => page.includeInSitemap && this.getCanonicalUrl(page, global) === this.absoluteUrl(siteUrl, page.customSlug || page.url))
      .map((page) => `  <url>\n    <loc>${this.absoluteUrl(siteUrl, page.customSlug || page.url)}</loc>\n  </url>`)
      .join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    const result = await this.seoSettingsModel
      .findOneAndUpdate(
        { key: 'default' },
        { sitemapXml, sitemapGeneratedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();
    this.realtimeService.publish('seo', 'regenerated', 'XML sitemap regenerated');
    return result;
  }

  private async ensureSettings() {
    const settings = await this.seoSettingsModel.findOne({ key: 'default' }).lean().exec();
    if (settings) return settings;
    return this.seoSettingsModel.create(this.createDefaultSettings()).then((doc) => doc.toObject());
  }

  private createDefaultSettings() {
    const pages = defaultPages.map((page) =>
      this.normalizePage({
        ...page,
        metaTitle: page.pageName,
        metaDescription: defaultGlobal.defaultMetaDescription,
        focusKeyword: page.pageName.toLowerCase(),
        canonicalMode: 'self',
        canonicalUrl: '',
        openGraph: { title: page.pageName, description: defaultGlobal.defaultMetaDescription, image: '' },
        twitter: { title: page.pageName, description: defaultGlobal.defaultMetaDescription, image: '' },
        robotsIndex: 'index',
        robotsFollow: 'follow',
        includeInSitemap: true,
        schemaJson: this.schemaTemplate(page.schemaType, page.pageName),
      }),
    );

    return {
      key: 'default',
      pages,
      redirects: [],
      robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://radiconlab.com/sitemap.xml',
      global: defaultGlobal,
    };
  }

  private normalizePage(page: SeoPageDto) {
    return {
      id: page.id || randomUUID(),
      pageName: page.pageName,
      pageType: page.pageType,
      url: this.normalizePath(page.url),
      customSlug: page.customSlug ? this.normalizePath(page.customSlug) : '',
      canonicalUrl: page.canonicalUrl || '',
      canonicalMode: page.canonicalMode || 'self',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      focusKeyword: page.focusKeyword || '',
      openGraph: page.openGraph || {},
      twitter: page.twitter || {},
      robotsIndex: page.robotsIndex || 'index',
      robotsFollow: page.robotsFollow || 'follow',
      includeInSitemap: page.includeInSitemap ?? true,
      schemaType: page.schemaType || page.pageType || 'WebPage',
      schemaJson: page.schemaJson || this.schemaTemplate(page.schemaType || page.pageType, page.pageName),
    };
  }

  private analyzePage(page: any, global: SeoGlobalSettings) {
    const checks = [
      page.metaTitle?.length > 10 && page.metaTitle.length <= 60,
      page.metaDescription?.length > 50 && page.metaDescription.length <= 160,
      page.focusKeyword && `${page.metaTitle} ${page.metaDescription}`.toLowerCase().includes(page.focusKeyword.toLowerCase()),
      Boolean(this.getCanonicalUrl(page, global)),
      page.openGraph?.title && page.openGraph?.description,
      page.twitter?.title && page.twitter?.description,
      page.schemaJson && this.isValidJson(page.schemaJson),
    ];
    const passed = checks.filter(Boolean).length;
    const score = Math.round((passed / checks.length) * 100);

    return {
      pageId: page.id,
      score,
      status: score >= 80 ? 'green' : score >= 55 ? 'yellow' : 'red',
      canonicalStatus: this.getCanonicalUrl(page, global) ? 'set' : 'not set',
      canonicalIssue: !this.getCanonicalUrl(page, global),
    };
  }

  private getCanonicalUrl(page: any, global: SeoGlobalSettings) {
    const siteUrl = global.siteUrl.replace(/\/$/, '');
    if (page.canonicalUrl) return page.canonicalUrl;
    return this.absoluteUrl(siteUrl, page.customSlug || page.url);
  }

  private absoluteUrl(siteUrl: string, path: string) {
    if (path.startsWith('http')) return path;
    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private toPublicRoute(page: any, global: SeoGlobalSettings): PublicSeoRoute {
    const url = this.normalizePath(page.url || '/');
    const customSlug = page.customSlug ? this.normalizePath(page.customSlug) : '';
    const path = customSlug || url;

    return {
      id: page.id,
      pageName: page.pageName,
      pageType: page.pageType,
      url,
      customSlug,
      path,
      canonicalUrl: page.canonicalUrl || this.absoluteUrl(global.siteUrl.replace(/\/$/, ''), path),
      canonicalMode: page.canonicalMode || 'self',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      focusKeyword: page.focusKeyword || '',
      openGraph: page.openGraph || {},
      twitter: page.twitter || {},
      robotsIndex: page.robotsIndex || 'index',
      robotsFollow: page.robotsFollow || 'follow',
      schemaType: page.schemaType || page.pageType || 'WebPage',
    };
  }

  private normalizePath(value: string) {
    const trimmed = (value || '/').trim();

    if (!trimmed || trimmed === '/') return '/';
    if (trimmed.startsWith('http')) return trimmed;

    const path = trimmed
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean)
      .map((segment) =>
        segment
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      )
      .filter(Boolean)
      .join('/');

    return path ? `/${path}` : '/';
  }

  private schemaTemplate(type = 'WebPage', name = 'Page') {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': type,
        name,
      },
      null,
      2,
    );
  }

  private isValidJson(value: string) {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }
}
