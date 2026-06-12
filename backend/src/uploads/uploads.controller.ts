import {
  BadRequestException,
  Controller,
  Body,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const uploadFolders = {
  products: 'products',
  blogs: 'blogs',
} as const;

type UploadFolderType = keyof typeof uploadFolders;

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  @Post('images')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['products', 'blogs'],
        },
      },
    },
  })
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        if (!allowedImageTypes.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Only JPG, PNG, and WEBP images are allowed.',
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: UploadedImageFile | undefined,
    @Body('type') type: UploadFolderType = 'products',
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    const folder = uploadFolders[type];
    if (!folder) {
      throw new BadRequestException('Invalid upload type.');
    }

    const uploadDir = join(process.cwd(), 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const extension = mimeToExtension(file.mimetype);
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, file.buffer);

    const uploadPath = `/uploads/${folder}/${filename}`;

    return {
      url: uploadPath,
      path: uploadPath,
    };
  }
}

function mimeToExtension(mimeType: string) {
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  return '.jpg';
}
