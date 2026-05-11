import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>;

export enum ProductStatus {
  Active = 'active',
  Draft = 'draft',
  Archived = 'archived',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug: string;

  @Prop({ required: true, trim: true })
  sku: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true, index: true })
  category: Types.ObjectId;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true, default: '' })
  shortDescription: string;

  @Prop({ default: '' })
  fullContent: string;

  @Prop({ required: true, trim: true })
  image: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ trim: true, default: '' })
  metaTitle: string;

  @Prop({ trim: true, default: '' })
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  seoKeywords: string[];

  @Prop({ trim: true, default: '' })
  canonicalUrl: string;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.Draft, index: true })
  status: ProductStatus;

  @Prop({ type: Number, default: 0, index: true })
  sortOrder: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
