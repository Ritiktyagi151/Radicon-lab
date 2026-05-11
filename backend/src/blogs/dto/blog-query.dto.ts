import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { BlogStatus } from '../schemas/blog.schema';

export class BlogQueryDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value) || 1)
  @IsPositive()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value) || 9)
  @IsPositive()
  @Max(100)
  @IsOptional()
  limit?: number = 9;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: BlogStatus })
  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;
}
