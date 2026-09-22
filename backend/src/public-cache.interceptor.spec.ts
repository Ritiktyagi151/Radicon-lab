import type { ExecutionContext } from '@nestjs/common';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { PublicCacheInterceptor } from './public-cache.interceptor';
import { RealtimeService } from './realtime/realtime.service';

function context(url: string, method = 'GET', authorization?: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ originalUrl: url, method, headers: { authorization } }),
    }),
  } as ExecutionContext;
}

describe('Public API cache', () => {
  let realtime: RealtimeService;
  let cache: PublicCacheInterceptor;
  beforeEach(() => {
    jest.useFakeTimers();
    realtime = new RealtimeService();
    cache = new PublicCacheInterceptor(realtime);
  });
  afterEach(() => {
    cache.onModuleDestroy();
    jest.useRealTimers();
  });

  it('reuses public responses and expires after 30 seconds', async () => {
    const next = { handle: jest.fn(() => of(['product'])) };
    const request = context('/api/products?status=active');
    await firstValueFrom(cache.intercept(request, next));
    await firstValueFrom(cache.intercept(request, next));
    expect(next.handle).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(30001);
    await firstValueFrom(cache.intercept(request, next));
    expect(next.handle).toHaveBeenCalledTimes(2);
  });

  it('invalidates immediately on admin content updates', async () => {
    const next = { handle: jest.fn(() => of(['old'])) };
    const request = context('/api/seo-routes');
    await firstValueFrom(cache.intercept(request, next));
    realtime.publish('seo', 'updated', 'Saved');
    next.handle.mockReturnValue(of(['new']));
    expect(await firstValueFrom(cache.intercept(request, next))).toEqual(['new']);
    expect(next.handle).toHaveBeenCalledTimes(2);
  });

  it('does not retain a response that started before an update', async () => {
    const pending = new Subject<string>();
    const request = context('/api/blogs?status=published');
    const first = firstValueFrom(cache.intercept(request, { handle: () => pending }));
    realtime.publish('blogs', 'updated', 'Saved');
    pending.next('old');
    await first;
    const next = { handle: jest.fn(() => of('new')) };
    expect(await firstValueFrom(cache.intercept(request, next))).toBe('new');
    expect(next.handle).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['/api/products', 'GET', undefined],
    ['/api/blogs?status=draft', 'GET', undefined],
    ['/api/categories?includeDrafts=true', 'GET', undefined],
    ['/api/contacts', 'GET', undefined],
    ['/api/seo-routes', 'POST', undefined],
    ['/api/products?status=active', 'GET', 'Bearer admin'],
  ])('bypasses non-public requests: %s %s', async (url, method, authorization) => {
    const next = { handle: jest.fn(() => of('response')) };
    const request = context(url, method, authorization);
    await firstValueFrom(cache.intercept(request, next));
    await firstValueFrom(cache.intercept(request, next));
    expect(next.handle).toHaveBeenCalledTimes(2);
  });

  it('separates query values but normalizes parameter order', async () => {
    const next = { handle: jest.fn(() => of('response')) };
    for (const url of [
      '/api/products?status=active&category=a',
      '/api/products?category=a&status=active',
      '/api/products?status=active&category=b',
    ]) await firstValueFrom(cache.intercept(context(url), next));
    expect(next.handle).toHaveBeenCalledTimes(2);
  });

  it('does not cache failed requests', async () => {
    const request = context('/api/seo-routes');
    await expect(firstValueFrom(cache.intercept(request, {
      handle: () => throwError(() => new Error('offline')),
    }))).rejects.toThrow('offline');
    const next = { handle: jest.fn(() => of('recovered')) };
    expect(await firstValueFrom(cache.intercept(request, next))).toBe('recovered');
  });
});
