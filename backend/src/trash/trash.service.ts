import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from '../blogs/schemas/blog.schema';
import { Category } from '../categories/schemas/category.schema';
import { Contact } from '../contacts/schemas/contact.schema';
import { Product } from '../products/schemas/product.schema';
import { RealtimeService } from '../realtime/realtime.service';
import { SeoSettings } from '../seo/schemas/seo-settings.schema';

type DocumentResource = 'products' | 'categories' | 'blogs' | 'contacts';
type TrashRecord = {
  _id: Types.ObjectId;
  name?: string;
  title?: string;
  subject?: string;
  slug?: string;
  category?: Types.ObjectId;
  deletedAt?: Date | null;
};

@Injectable()
export class TrashService {
  private readonly models: Record<DocumentResource, Model<TrashRecord>>;

  constructor(
    @InjectModel(Product.name) products: Model<Product>,
    @InjectModel(Category.name) categories: Model<Category>,
    @InjectModel(Blog.name) blogs: Model<Blog>,
    @InjectModel(Contact.name) contacts: Model<Contact>,
    @InjectModel(SeoSettings.name) private readonly seo: Model<SeoSettings>,
    private readonly realtime: RealtimeService,
  ) {
    this.models = { products, categories, blogs, contacts } as unknown as Record<DocumentResource, Model<TrashRecord>>;
  }

  async findAll() {
    const groups = await Promise.all((Object.keys(this.models) as DocumentResource[]).map(async (resource) => {
      const records = await this.models[resource].find({ deletedAt: { $ne: null } })
        .select('name title subject slug deletedAt').lean().exec();
      return records.map((record) => ({
        id: String(record._id), resource,
        title: record.title || record.subject || record.name || 'Untitled',
        slug: record.slug || '', deletedAt: record.deletedAt!,
      }));
    }));
    const settings = await this.seo.findOne({ key: 'default' }).lean().exec();
    const pages = (settings?.pages || []).filter((page) => page.deletedAt).map((page) => ({
      id: page.id, resource: 'seo', title: page.pageName,
      slug: page.customSlug || page.url, deletedAt: page.deletedAt!,
    }));
    return [...groups.flat(), ...pages].sort((a, b) =>
      new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
  }

  async moveToTrash(resource: string, id: string) {
    if (resource === 'seo') {
      const result = await this.seo.updateOne(
        { key: 'default', pages: { $elemMatch: { id, deletedAt: null } } },
        { $set: { 'pages.$.deletedAt': new Date() }, $unset: { sitemapXml: '', sitemapGeneratedAt: '' } },
      ).exec();
      if (!result.modifiedCount) throw new NotFoundException('SEO record not found');
      this.realtime.publish('seo', 'deleted', 'SEO record moved to Trash');
    } else {
      const model = this.getModel(resource, id);
      if (resource === 'categories' && await this.models.products.exists({ category: id, deletedAt: null })) {
        throw new ConflictException('Move or trash this category’s products before moving the category to Trash.');
      }
      const record = await model.findOneAndUpdate(
        { _id: id, deletedAt: null }, { $set: { deletedAt: new Date() } }, { new: true },
      ).lean().exec();
      if (!record) throw new NotFoundException('Record not found');
      this.realtime.publish(resource as DocumentResource, 'deleted', `${record.title || record.subject || record.name} moved to Trash`);
    }
    return { message: 'Moved to Trash. You can restore it from the Trash page.' };
  }

  async restore(resource: string, id: string) {
    if (resource === 'seo') {
      const settings = await this.seo.findOne({ key: 'default' }).lean().exec();
      const page = settings?.pages.find((item) => item.id === id && item.deletedAt);
      if (!page) throw new NotFoundException('Trashed SEO record not found');
      if (settings!.pages.some((item) => !item.deletedAt && item.id !== id &&
        ((item.customSlug || item.url) === (page.customSlug || page.url) || item.url === page.url))) {
        throw new ConflictException('An SEO record already uses this URL. Update it before restoring this record.');
      }
      const result = await this.seo.updateOne(
        { key: 'default', pages: { $elemMatch: { id, deletedAt: { $ne: null } } } },
        { $unset: { 'pages.$.deletedAt': '', sitemapXml: '', sitemapGeneratedAt: '' } },
      ).exec();
      if (!result.modifiedCount) throw new NotFoundException('Trashed SEO record not found');
      this.realtime.publish('seo', 'updated', `SEO record restored: ${page.pageName}`);
    } else {
      const model = this.getModel(resource, id);
      const record = await model.findOne({ _id: id, deletedAt: { $ne: null } }).lean().exec();
      if (!record) throw new NotFoundException('Trashed record not found');
      if (resource === 'products' && !await this.models.categories.exists({ _id: record.category, deletedAt: null })) {
        throw new ConflictException('Restore the product’s category before restoring this product.');
      }
      const restored = await model.findOneAndUpdate(
        { _id: id, deletedAt: { $ne: null } }, { $unset: { deletedAt: '' } }, { new: true },
      ).lean().exec();
      if (!restored) throw new NotFoundException('Trashed record not found');
      this.realtime.publish(resource as DocumentResource, 'updated', `${record.title || record.subject || record.name} restored`);
    }
    return { message: 'Restored successfully' };
  }

  private getModel(resource: string, id: string) {
    if (!Object.prototype.hasOwnProperty.call(this.models, resource)) {
      throw new BadRequestException('Unsupported Trash resource');
    }
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid record ID');
    return this.models[resource as DocumentResource];
  }
}
