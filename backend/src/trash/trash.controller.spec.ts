import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthService } from '../auth/auth.service';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';

describe('Trash admin API', () => {
  let app: INestApplication<App>;
  const trash = { findAll: jest.fn(), restore: jest.fn() };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [TrashController],
      providers: [
        { provide: TrashService, useValue: trash },
        { provide: AuthService, useValue: { verify: (token: string) => {
          if (token !== 'test-admin') throw new UnauthorizedException('Invalid token');
        } } },
      ],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });
  beforeEach(() => jest.clearAllMocks());
  afterAll(async () => { await app.close(); });

  it('rejects unauthenticated Trash reads without accessing stored items', async () => {
    await request(app.getHttpServer()).get('/api/trash').expect(401);
    expect(trash.findAll).not.toHaveBeenCalled();
  });

  it('rejects restores with an invalid admin token', async () => {
    await request(app.getHttpServer()).post('/api/trash/products/item/restore')
      .set('Authorization', 'Bearer wrong').expect(401);
    expect(trash.restore).not.toHaveBeenCalled();
  });

  it('returns Trash items to an authenticated admin', async () => {
    trash.findAll.mockResolvedValue([{ id: 'item', resource: 'products', title: 'Product' }]);
    await request(app.getHttpServer()).get('/api/trash')
      .set('Authorization', 'Bearer test-admin').expect(200)
      .expect([{ id: 'item', resource: 'products', title: 'Product' }]);
  });

  it('routes an authenticated restore request to the correct resource and ID', async () => {
    trash.restore.mockResolvedValue({ message: 'Restored successfully' });
    await request(app.getHttpServer()).post('/api/trash/blogs/item/restore')
      .set('Authorization', 'Bearer test-admin').expect(201)
      .expect({ message: 'Restored successfully' });
    expect(trash.restore).toHaveBeenCalledWith('blogs', 'item');
  });
});
