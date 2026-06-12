import {
  BadRequestException,
  Controller,
  Body,
  Post,
  Req,
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
import type { Request } from 'express';

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
    @Req() request: Request,
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

    return {
      url: `${getPublicOrigin(request)}/uploads/${folder}/${filename}`,
      path: `uploads/${folder}/${filename}`,
    };
  }
}

function mimeToExtension(mimeType: string) {
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  return '.jpg';
}

function getPublicOrigin(request: Request) {
  const configuredOrigin = process.env.PUBLIC_API_ORIGIN;
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, '');
  }

  const forwardedProtocol = getForwardedHeaderValue(request, 'x-forwarded-proto');
  const forwardedHost = getForwardedHeaderValue(request, 'x-forwarded-host');
  const protocol = forwardedProtocol || request.protocol;
  const host = forwardedHost || request.get('host');

  return `${protocol}://${host}`;
}

function getForwardedHeaderValue(request: Request, header: string) {
  const value = request.get(header);
  return value?.split(',')[0]?.trim();
}
