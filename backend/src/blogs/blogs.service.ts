import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument, BlogStatus } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const slug = this.normalizeSlug(createBlogDto.slug || createBlogDto.title);
    await this.ensureSlugIsAvailable(slug);

    const createdBlog = await this.blogModel.create({
      ...createBlogDto,
      slug,
      tags: createBlogDto.tags || [],
    });

    this.realtimeService.publish(
      'blogs',
      'created',
      `Blog created: ${createdBlog.title}`,
    );

    return createdBlog.toObject();
  }

  async findAll(query: BlogQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 9;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};

    if (query.status) filter.status = query.status;
    if (query.category && query.category !== 'All')
      filter.category = query.category;
    if (query.search) {
      const searchRegex = new RegExp(this.escapeRegex(query.search), 'i');
      filter.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    const [data, total] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.blogModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findFeatured() {
    const blog = await this.blogModel
      .findOne({ status: BlogStatus.Published })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean()
      .exec();

    if (!blog) throw new NotFoundException('Featured blog not found');

    return blog;
  }

  async findCategories() {
    return this.blogModel
      .distinct('category', { status: BlogStatus.Published })
      .exec();
  }

  async findBySlug(slug: string) {
    const blog = await this.blogModel.findOne({ slug }).lean().exec();

    if (!blog) throw new NotFoundException('Blog not found');

    this.realtimeService.publish(
      'blogs',
      'updated',
      `Blog updated: ${blog.title}`,
    );

    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const payload = { ...updateBlogDto };

    if (payload.slug) {
      payload.slug = this.normalizeSlug(payload.slug);
      await this.ensureSlugIsAvailable(payload.slug, id);
    }

    const blog = await this.blogModel
      .findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!blog) throw new NotFoundException('Blog not found');

    return blog;
  }

  async remove(id: string) {
    const blog = await this.blogModel.findByIdAndDelete(id).lean().exec();

    if (!blog) throw new NotFoundException('Blog not found');

    this.realtimeService.publish(
      'blogs',
      'deleted',
      `Blog deleted: ${blog.title}`,
    );

    return { message: 'Blog deleted successfully' };
  }

  private async ensureSlugIsAvailable(slug: string, ignoredId?: string) {
    const existingBlog = await this.blogModel.findOne({ slug }).lean().exec();

    if (existingBlog && String(existingBlog._id) !== ignoredId) {
      throw new ConflictException('Blog slug already exists');
    }
  }

  private normalizeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
