import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument, CategoryStatus } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const slug = this.normalizeSlug(dto.slug || dto.name);
    await this.ensureSlugIsAvailable(slug);
    const sortOrder = dto.sortOrder ?? (await this.getNextSortOrder());

    const category = await this.categoryModel.create({ ...dto, slug, sortOrder });
    this.realtimeService.publish('categories', 'created', `Category created: ${category.name}`);

    return category.toObject();
  }

  findAll(includeDrafts = true) {
    const filter = includeDrafts ? {} : { status: CategoryStatus.Active };
    return this.categoryModel.find(filter).sort({ sortOrder: 1, name: 1 }).lean().exec();
  }

  async findById(id: string) {
    const category = await this.categoryModel.findById(id).lean().exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryModel
      .findOne({ slug: this.normalizeSlug(slug), status: CategoryStatus.Active })
      .lean()
      .exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const payload = { ...dto };
    if (payload.slug) {
      payload.slug = this.normalizeSlug(payload.slug);
      await this.ensureSlugIsAvailable(payload.slug, id);
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!category) throw new NotFoundException('Category not found');
    this.realtimeService.publish('categories', 'updated', `Category updated: ${category.name}`);
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id).lean().exec();
    if (!category) throw new NotFoundException('Category not found');
    this.realtimeService.publish('categories', 'deleted', `Category deleted: ${category.name}`);
    return { message: 'Category deleted successfully' };
  }

  async reorder(items: Array<{ id: string; sortOrder: number }>) {
    await Promise.all(
      items.map((item, index) =>
        this.categoryModel
          .findByIdAndUpdate(item.id, { sortOrder: item.sortOrder ?? index }, { runValidators: true })
          .lean()
          .exec(),
      ),
    );

    this.realtimeService.publish('categories', 'updated', 'Category order updated');
    return this.findAll(true);
  }

  private async ensureSlugIsAvailable(slug: string, ignoredId?: string) {
    const existingCategory = await this.categoryModel.findOne({ slug }).lean().exec();
    if (existingCategory && String(existingCategory._id) !== ignoredId) {
      throw new ConflictException('Category slug already exists');
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
    const lastCategory = await this.categoryModel.findOne().sort({ sortOrder: -1 }).lean().exec();
    return typeof lastCategory?.sortOrder === 'number' ? lastCategory.sortOrder + 1 : 0;
  }
}
