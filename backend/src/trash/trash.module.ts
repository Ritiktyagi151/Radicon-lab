import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Blog, BlogSchema } from '../blogs/schemas/blog.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Contact, ContactSchema } from '../contacts/schemas/contact.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { RealtimeModule } from '../realtime/realtime.module';
import { SeoSettings, SeoSettingsSchema } from '../seo/schemas/seo-settings.schema';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';

@Global()
@Module({
  imports: [AuthModule, RealtimeModule, MongooseModule.forFeature([
    { name: Blog.name, schema: BlogSchema },
    { name: Category.name, schema: CategorySchema },
    { name: Contact.name, schema: ContactSchema },
    { name: Product.name, schema: ProductSchema },
    { name: SeoSettings.name, schema: SeoSettingsSchema },
  ])],
  controllers: [TrashController],
  providers: [TrashService],
  exports: [TrashService],
})
export class TrashModule {}
