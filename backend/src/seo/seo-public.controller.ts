import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeoService } from './seo.service';

@ApiTags('SEO Routes')
@Controller('seo-routes')
export class SeoPublicController {
  constructor(private readonly seoService: SeoService) {}

  @Get()
  findAll() {
    return this.seoService.getPublicRoutes();
  }

  @Get('resolve')
  resolve(@Query('path') path = '/') {
    return this.seoService.resolvePublicRoute(path);
  }
}
