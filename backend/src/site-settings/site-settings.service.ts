import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettings, SiteSettingsDocument } from './schemas/site-settings.schema';
import { RealtimeService } from '../realtime/realtime.service';

const defaultSettings = {
  key: 'default',
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Contact', href: '/contact' },
  ],
  socialLinks: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
    x: '#',
  },
  copyrightText: 'Copyright Radicon Lab. All rights reserved.',
  version: '1.0.0',
};

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly siteSettingsModel: Model<SiteSettingsDocument>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async find() {
    const settings = await this.siteSettingsModel.findOne({ key: 'default' }).lean().exec();
    return settings || defaultSettings;
  }

  async update(updateSiteSettingsDto: UpdateSiteSettingsDto) {
    const settings = await this.siteSettingsModel
      .findOneAndUpdate(
        { key: 'default' },
        { ...updateSiteSettingsDto, key: 'default' },
        { new: true, upsert: true, runValidators: true },
      )
      .lean()
      .exec();
    this.realtimeService.publish('site-settings', 'updated', 'Navigation and footer settings updated');
    return settings;
  }
}
