import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument, ProductStatus } from './schemas/product.schema';
import { RealtimeService } from '../realtime/realtime.service';
import { CategoryStatus } from '../categories/schemas/category.schema';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    private readonly realtimeService: RealtimeService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async onModuleInit() {
    await this.removeLegacyDetailFields();
  }

  async create(createProductDto: CreateProductDto) {
    const slug = this.normalizeSlug(createProductDto.slug || createProductDto.name);
    await this.ensureSlugIsAvailable(slug);
    await this.categoriesService.findById(createProductDto.category);
    const sortOrder = createProductDto.sortOrder ?? (await this.getNextSortOrder());
    const shortDescription = createProductDto.shortDescription || createProductDto.description || '';

    const product = await this.productModel.create({
      ...createProductDto,
      slug,
      description: shortDescription,
      shortDescription,
      fullContent: createProductDto.fullContent || '',
      sortOrder,
      gallery: createProductDto.gallery || [],
      tags: createProductDto.tags || [],
      seoKeywords: createProductDto.seoKeywords || [],
      canonicalUrl: createProductDto.canonicalUrl || '',
    });

    this.realtimeService.publish('products', 'created', `Product created: ${product.name}`);

    return product.toObject();
  }

  findAll(query: { category?: string; search?: string; status?: string } = {}) {
    const filter: Record<string, unknown> = {};

    if (query.status) filter.status = query.status;
    if (query.category && Types.ObjectId.isValid(query.category)) filter.category = query.category;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { tags: { $regex: query.search, $options: 'i' } },
      ];
    }

    return this.productModel
      .find(filter)
      .select('-features -specifications -faqs')
      .populate('category', 'name slug image description')
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .select('-features -specifications -faqs')
      .populate('category', 'name slug image description')
      .lean()
      .exec();

    if (!product) throw new NotFoundException('Product not found');

    this.realtimeService.publish('products', 'updated', `Product updated: ${product.name}`);

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productModel
      .findOne({ slug: this.normalizeSlug(slug), status: 'active' })
      .select('-features -specifications -faqs')
      .populate('category', 'name slug image description')
      .lean()
      .exec();

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async findRelated(id: string, categoryId: string) {
    return this.productModel
      .find({ _id: { $ne: id }, category: categoryId, status: 'active' })
      .select('-features -specifications -faqs')
      .populate('category', 'name slug')
      .limit(4)
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const payload = { ...updateProductDto };
    delete (payload as Record<string, unknown>).features;
    delete (payload as Record<string, unknown>).specifications;
    delete (payload as Record<string, unknown>).faqs;

    if (payload.slug) {
      payload.slug = this.normalizeSlug(payload.slug);
      await this.ensureSlugIsAvailable(payload.slug, id);
    }

    if (payload.category) {
      await this.categoriesService.findById(payload.category);
    }

    if (payload.shortDescription) {
      payload.description = payload.shortDescription;
    }

    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { $set: payload, $unset: { features: '', specifications: '', faqs: '' } },
        { new: true, runValidators: true },
      )
      .select('-features -specifications -faqs')
      .populate('category', 'name slug image description')
      .lean()
      .exec();

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).lean().exec();

    if (!product) throw new NotFoundException('Product not found');

    this.realtimeService.publish('products', 'deleted', `Product deleted: ${product.name}`);

    return { message: 'Product deleted successfully' };
  }

  async reorder(items: Array<{ id: string; sortOrder: number }>) {
    await Promise.all(
      items.map((item, index) =>
        this.productModel
          .findByIdAndUpdate(item.id, { sortOrder: item.sortOrder ?? index }, { runValidators: true })
          .lean()
          .exec(),
      ),
    );

    this.realtimeService.publish('products', 'updated', 'Product order updated');
    return this.findAll();
  }

  async seedSampleData() {
    const sampleCategories = [
      { name: 'Tablets', slug: 'tablets', description: 'Quality tablet formulations for dependable pharmaceutical manufacturing.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80' },
      { name: 'Capsules', slug: 'capsules', description: 'Capsule products with consistent formulation and packaging support.', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80' },
      { name: 'Ointments', slug: 'ointments', description: 'Topical creams and ointment product ranges for external applications.', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80' },
      { name: 'Oral Strips', slug: 'oral-strips', description: 'Orally disintegrating strip products for convenient dosage formats.', image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=900&q=80' },
    ];

    const existingCategories = await this.categoriesService.findAll(true);
    const categoryMap = new Map(existingCategories.map((category) => [category.slug, String(category._id)]));

    for (const category of sampleCategories) {
      if (!categoryMap.has(category.slug)) {
        const created = await this.categoriesService.create({
          ...category,
          metaTitle: `${category.name} Products`,
          metaDescription: category.description,
          status: CategoryStatus.Active,
        });
        categoryMap.set(category.slug, String(created._id));
      }
    }

    const samples = [
      { categorySlug: 'tablets', name: 'Radicon Tablet Range', sku: 'RAD-TAB-001' },
      { categorySlug: 'capsules', name: 'Radicon Capsule Range', sku: 'RAD-CAP-001' },
      { categorySlug: 'ointments', name: 'Radicon Ointment Range', sku: 'RAD-OIN-001' },
      { categorySlug: 'oral-strips', name: 'Radicon Oral Strip Range', sku: 'RAD-ODS-001' },
    ];

    for (const sample of samples) {
      const slug = this.normalizeSlug(sample.name);
      const exists = await this.productModel.findOne({ slug }).lean().exec();
      if (exists) continue;

      await this.productModel.create({
        name: sample.name,
        slug,
        sku: sample.sku,
        category: categoryMap.get(sample.categorySlug),
        description: 'Sample product information for testing dynamic product pages, admin editing, SEO fields, detailed content, and related products.',
        shortDescription: 'Sample product information for testing dynamic product pages and admin editing.',
        fullContent: '<p>Detailed product content can be managed from the admin panel with rich formatting.</p>',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
        gallery: [],
        tags: ['sample', 'pharma'],
        metaTitle: sample.name,
        metaDescription: 'Sample Radicon product detail page content.',
        seoKeywords: ['sample', 'pharma'],
        canonicalUrl: '',
        status: ProductStatus.Active,
      });
    }

    return { message: 'Sample categories and products are ready.' };
  }

  private async ensureSlugIsAvailable(slug: string, ignoredId?: string) {
    const existingProduct = await this.productModel.findOne({ slug }).lean().exec();

    if (existingProduct && String(existingProduct._id) !== ignoredId) {
      throw new ConflictException('Product slug already exists');
    }
  }

  private normalizeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async getNextSortOrder() {
    const lastProduct = await this.productModel.findOne().sort({ sortOrder: -1 }).lean().exec();
    return typeof lastProduct?.sortOrder === 'number' ? lastProduct.sortOrder + 1 : 0;
  }

  private async removeLegacyDetailFields() {
    await this.productModel
      .updateMany({}, { $unset: { features: '', specifications: '', faqs: '' } })
      .exec();
  }
}
