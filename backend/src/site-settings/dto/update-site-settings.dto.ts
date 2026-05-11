import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class NavLinkDto {
  @IsString()
  label: string;

  @IsString()
  href: string;
}

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional({ type: [NavLinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavLinkDto)
  @IsOptional()
  navLinks?: NavLinkDto[];

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  socialLinks?: Record<string, string>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  copyrightText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  version?: string;
}
