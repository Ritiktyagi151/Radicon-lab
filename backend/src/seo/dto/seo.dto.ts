import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class SeoPageDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  pageName: string;

  @IsString()
  pageType: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  customSlug?: string;

  @IsString()
  @IsOptional()
  canonicalUrl?: string;

  @IsIn(['self', 'custom'])
  @IsOptional()
  canonicalMode?: 'self' | 'custom';

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  focusKeyword?: string;

  @ValidateNested()
  @Type(() => SocialDto)
  @IsOptional()
  openGraph?: SocialDto;

  @ValidateNested()
  @Type(() => SocialDto)
  @IsOptional()
  twitter?: SocialDto;

  @IsIn(['index', 'noindex'])
  @IsOptional()
  robotsIndex?: 'index' | 'noindex';

  @IsIn(['follow', 'nofollow'])
  @IsOptional()
  robotsFollow?: 'follow' | 'nofollow';

  @IsBoolean()
  @IsOptional()
  includeInSitemap?: boolean;

  @IsString()
  @IsOptional()
  schemaType?: string;

  @IsString()
  @IsOptional()
  schemaJson?: string;
}

export class RedirectDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  oldUrl: string;

  @IsString()
  newUrl: string;

  @IsNumber()
  @IsIn([301, 302])
  type: 301 | 302;
}

export class RobotsDto {
  @IsString()
  robotsTxt: string;
}

export class GlobalSeoDto {
  @ApiPropertyOptional()
  @IsString()
  metaTitleFormat: string;

  @IsString()
  defaultMetaDescription: string;

  @IsIn(['self', 'manual'])
  canonicalBehavior: 'self' | 'manual';

  @IsString()
  @IsOptional()
  googleAnalyticsId?: string;

  @IsString()
  @IsOptional()
  googleSearchConsoleCode?: string;

  @IsString()
  @IsOptional()
  faviconUrl?: string;

  @IsString()
  siteUrl: string;
}

export class RedirectsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RedirectDto)
  redirects: RedirectDto[];
}

export class PagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeoPageDto)
  pages: SeoPageDto[];
}
