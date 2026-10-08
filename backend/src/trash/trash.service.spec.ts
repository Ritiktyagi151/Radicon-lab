import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Blog } from '../blogs/schemas/blog.schema';
import { Category } from '../categories/schemas/category.schema';
import { Contact } from '../contacts/schemas/contact.schema';
import { Product } from '../products/schemas/product.schema';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { BlogsService } from '../blogs/blogs.service';
import { ContactsService } from '../contacts/contacts.service';
import { RealtimeService } from '../realtime/realtime.service';
import { SeoService } from '../seo/seo.service';
import { SeoSettings } from '../seo/schemas/seo-settings.schema';
import { TrashService } from './trash.service';

const id = new Types.ObjectId().toString();
const categoryId = new Types.ObjectId();
const deletedAt = new Date('2026-10-08T10:00:00Z');
function query(value: unknown) {
  const chain = {
    lean: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(value),
  };
  return chain;
}
function model() {
  return {
    find: jest.fn().mockImplementation(() => query([])),
    findOne: jest.fn().mockImplementation(() => query(null)),
    findOneAndUpdate: jest.fn().mockImplementation(() => query(null)),
    updateOne: jest.fn().mockImplementation(() => query({ modifiedCount: 1, matchedCount: 1 })),
    exists: jest.fn().mockResolvedValue(null),
    countDocuments: jest.fn().mockImplementation(() => query(0)),
    distinct: jest.fn().mockImplementation(() => query([])),
  };
}

describe('Trash recovery', () => {
  let products: ReturnType<typeof model>;
  let categories: ReturnType<typeof model>;
  let blogs: ReturnType<typeof model>;
  let contacts: ReturnType<typeof model>;
  let seo: ReturnType<typeof model>;
  let realtime: RealtimeService;
  let service: TrashService;

  beforeEach(() => {
    products = model(); categories = model(); blogs = model(); contacts = model(); seo = model();
    realtime = { publish: jest.fn() } as unknown as RealtimeService;
    service = new TrashService(
      products as unknown as Model<Product>, categories as unknown as Model<Category>,
      blogs as unknown as Model<Blog>, contacts as unknown as Model<Contact>,
      seo as unknown as Model<SeoSettings>, realtime,
    );
  });

  it('marks a product as trashed without overwriting its content, slug or status', async () => {
    products.findOneAndUpdate.mockReturnValue(query({ _id: id, name: 'Sildenafil', slug: 'sildenafil', status: 'active' }));
    await service.moveToTrash('products', id);
    expect(products.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id, deletedAt: null }, { $set: { deletedAt: expect.any(Date) } }, { new: true },
    );
    expect(realtime.publish).toHaveBeenCalledWith('products', 'deleted', expect.stringContaining('Trash'));
  });

  it('restores the same product ID and only removes the deletion marker', async () => {
    products.findOne.mockReturnValue(query({ _id: id, name: 'Sildenafil', category: categoryId, deletedAt }));
    products.findOneAndUpdate.mockReturnValue(query({ _id: id }));
    categories.exists.mockResolvedValue({ _id: categoryId });
    await service.restore('products', id);
    expect(products.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id, deletedAt: { $ne: null } }, { $unset: { deletedAt: '' } }, { new: true },
    );
    expect(realtime.publish).toHaveBeenCalledWith('products', 'updated', expect.stringContaining('restored'));
  });

  it('rejects restoring a product until its category is restored', async () => {
    products.findOne.mockReturnValue(query({ _id: id, category: categoryId, deletedAt }));
    await expect(service.restore('products', id)).rejects.toThrow(ConflictException);
    expect(products.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('prevents trashing a category still used by non-trashed products', async () => {
    products.exists.mockResolvedValue({ _id: id });
    await expect(service.moveToTrash('categories', id)).rejects.toThrow(ConflictException);
    expect(categories.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects unknown resources and malformed IDs before querying MongoDB', async () => {
    await expect(service.restore('constructor', id)).rejects.toThrow(BadRequestException);
    await expect(service.restore('products', 'bad-id')).rejects.toThrow(BadRequestException);
    expect(products.findOne).not.toHaveBeenCalled();
  });

  it('does not restore a missing or already restored item', async () => {
    await expect(service.restore('blogs', id)).rejects.toThrow(NotFoundException);
    expect(blogs.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('lists only trashed records and sorts all resource types by deletion time', async () => {
    products.find.mockReturnValue(query([{ _id: id, name: 'Product', deletedAt }]));
    seo.findOne.mockReturnValue(query({ pages: [
      { id: 'active', pageName: 'Active', url: '/active' },
      { id: 'trash', pageName: 'SEO', url: '/seo', deletedAt: new Date('2026-10-09T10:00:00Z') },
    ] }));
    const items = await service.findAll();
    expect(items.map((item) => item.id)).toEqual(['trash', id]);
    expect(products.find).toHaveBeenCalledWith({ deletedAt: { $ne: null } });
  });

  it('removes only the requested SEO deletion flag on restore', async () => {
    seo.findOne.mockReturnValue(query({ pages: [{ id: 'seo-id', pageName: 'Service', url: '/service', deletedAt }] }));
    await service.restore('seo', 'seo-id');
    expect(seo.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({ pages: { $elemMatch: { id: 'seo-id', deletedAt: { $ne: null } } } }),
      { $unset: { 'pages.$.deletedAt': '', sitemapXml: '', sitemapGeneratedAt: '' } },
    );
  });

  it('rejects SEO restoration when another live record uses its public URL', async () => {
    seo.findOne.mockReturnValue(query({ pages: [
      { id: 'deleted', pageName: 'Old', url: '/service', deletedAt },
      { id: 'live', pageName: 'New', url: '/service' },
    ] }));
    await expect(service.restore('seo', 'deleted')).rejects.toThrow(ConflictException);
    expect(seo.updateOne).not.toHaveBeenCalled();
  });

  it('excludes trashed products from normal lists and public slug lookup', async () => {
    const svc = new ProductsService(service, products as never, realtime, {} as CategoriesService);
    await svc.findAll();
    expect(products.find).toHaveBeenCalledWith({ deletedAt: null });
    await expect(svc.findBySlug('sildenafil')).rejects.toThrow(NotFoundException);
    expect(products.findOne).toHaveBeenCalledWith({ slug: 'sildenafil', status: 'active', deletedAt: null });
  });

  it('excludes trashed blogs from pagination, featured lookup, categories and slug lookup', async () => {
    const svc = new BlogsService(service, blogs as never, realtime);
    await svc.findAll({});
    await svc.findCategories();
    await expect(svc.findFeatured()).rejects.toThrow(NotFoundException);
    await expect(svc.findBySlug('guide')).rejects.toThrow(NotFoundException);
    expect(blogs.countDocuments).toHaveBeenCalledWith({ deletedAt: null });
    expect(blogs.distinct).toHaveBeenCalledWith('category', { status: 'published', deletedAt: null });
    expect(blogs.findOne).toHaveBeenCalledWith({ slug: 'guide', deletedAt: null });
    expect(blogs.findOne).toHaveBeenCalledWith({ status: 'published', deletedAt: null });
  });

  it('excludes trashed categories and inquiries from their normal lists', async () => {
    const svc = new CategoriesService(service, categories as never, realtime);
    await svc.findAll(true);
    await svc.findAll(false);
    expect(categories.find).toHaveBeenCalledWith({ deletedAt: null });
    expect(categories.find).toHaveBeenCalledWith({ deletedAt: null, status: 'active' });
    await ContactsService.prototype.findAll.call({ contactModel: contacts });
    expect(contacts.find).toHaveBeenCalledWith({ deletedAt: null });
  });

  it('excludes trashed SEO records from public route resolution and admin settings', async () => {
    seo.findOne.mockReturnValue(query({ pages: [
      { id: 'live', pageName: 'Home', url: '/' },
      { id: 'deleted', pageName: 'Service', url: '/service', deletedAt },
    ], global: { siteUrl: 'https://www.radiconlab.com' } }));
    const svc = new SeoService(service, seo as never, realtime);
    expect((await svc.getPublicRoutes()).map((item) => item.id)).toEqual(['live']);
    expect((await svc.getSettings()).pages.map((item) => item.id)).toEqual(['live']);
    expect(await svc.resolvePublicRoute('/service')).toBeNull();
  });
});
