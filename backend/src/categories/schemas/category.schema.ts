import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

export enum CategoryStatus {
  Active = 'active',
  Draft = 'draft',
  Archived = 'archived',
}

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ trim: true, default: '' })
  image: string;

  @Prop({ trim: true, default: '' })
  metaTitle: string;

  @Prop({ trim: true, default: '' })
  metaDescription: string;

  @Prop({ type: String, enum: CategoryStatus, default: CategoryStatus.Draft, index: true })
  status: CategoryStatus;

  @Prop({ type: Number, default: 0, index: true })
  sortOrder: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
