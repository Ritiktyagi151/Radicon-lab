import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

export enum BlogStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  slug: string;

  @Prop({ required: true, trim: true })
  excerpt: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, trim: true })
  featuredImage: string;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ trim: true })
  seoTitle?: string;

  @Prop({ trim: true })
  seoDescription?: string;

  @Prop({
    type: String,
    enum: BlogStatus,
    default: BlogStatus.Draft,
    index: true,
  })
  status: BlogStatus;

  @Prop({ required: true, trim: true })
  readTime: string;

  @Prop({ type: Date, index: true })
  publishedAt?: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text',
});
