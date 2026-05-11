import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { GlobalSeoDto, RedirectsDto, RobotsDto, SeoPageDto } from './dto/seo.dto';
import { SeoService } from './seo.service';

@ApiTags('SEO')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get()
  getSettings() {
    return this.seoService.getSettings();
  }

  @Post('pages')
  savePage(@Body() pageDto: SeoPageDto) {
    return this.seoService.savePage(pageDto);
  }

  @Delete('pages/:id')
  deletePage(@Param('id') id: string) {
    return this.seoService.deletePage(id);
  }

  @Put('redirects')
  saveRedirects(@Body() redirectsDto: RedirectsDto) {
    return this.seoService.saveRedirects(redirectsDto.redirects);
  }

  @Put('robots')
  saveRobots(@Body() robotsDto: RobotsDto) {
    return this.seoService.saveRobots(robotsDto.robotsTxt);
  }

  @Put('global')
  saveGlobal(@Body() globalDto: GlobalSeoDto) {
    return this.seoService.saveGlobal(globalDto);
  }

  @Post('sitemap/regenerate')
  regenerateSitemap() {
    return this.seoService.regenerateSitemap();
  }
}
