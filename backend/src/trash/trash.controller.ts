import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { TrashService } from './trash.service';

@ApiTags('Trash')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('trash')
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get()
  findAll() {
    return this.trashService.findAll();
  }

  @Post(':resource/:id/restore')
  restore(@Param('resource') resource: string, @Param('id') id: string) {
    return this.trashService.restore(resource, id);
  }
}
