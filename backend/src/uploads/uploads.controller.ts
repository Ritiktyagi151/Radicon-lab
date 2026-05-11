import {
  BadRequestException,
  Controller,
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
    @Req() request: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    const uploadDir = join(process.cwd(), 'uploads', 'images');
    await mkdir(uploadDir, { recursive: true });

    const extension = mimeToExtension(file.mimetype);
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, file.buffer);

    return {
      url: `${getPublicOrigin(request)}/uploads/images/${filename}`,
    };
  }
}

function mimeToExtension(mimeType: string) {
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  return '.jpg';
}

function getPublicOrigin(request: Request) {
  return (
    process.env.PUBLIC_API_ORIGIN ||
    `${request.protocol}://${request.get('host')}`
  );
}
