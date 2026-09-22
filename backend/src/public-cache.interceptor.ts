import { CallHandler, ExecutionContext, Injectable, NestInterceptor, OnModuleDestroy } from '@nestjs/common';
import type { Request } from 'express';
import { Observable, of, tap, Subscription } from 'rxjs';
import { RealtimeService } from './realtime/realtime.service';

// Keep caching behind the API so frontend requests still see invalidation after edits.
@Injectable()
export class PublicCacheInterceptor implements NestInterceptor, OnModuleDestroy {
  private readonly entries = new Map<string, { value: unknown; expires: number }>();
  private revision = 0;
  private readonly subscription: Subscription;

  constructor(realtime: RealtimeService) {
    this.subscription = realtime.changes().subscribe((event) => {
      if (['products', 'categories', 'blogs', 'seo'].includes(event.resource)) {
        this.revision++;
        this.entries.clear();
      }
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method !== 'GET' || request.headers.authorization) return next.handle();
    const url = new URL(request.originalUrl, 'http://localhost');
    const path = url.pathname.replace(/\/$/, '');
    const cacheable = path === '/api/seo-routes'
      || path === '/api/seo-routes/resolve'
      || (path === '/api/products' && url.searchParams.get('status') === 'active')
      || (path === '/api/categories' && url.searchParams.get('includeDrafts') === 'false')
      || (path === '/api/blogs' && url.searchParams.get('status') === 'published')
      || path === '/api/blogs/featured'
      || path === '/api/blogs/categories';
    if (!cacheable) return next.handle();

    url.searchParams.sort();
    const key = path + url.search;
    const cached = this.entries.get(key);
    if (cached && cached.expires > Date.now()) return of(cached.value);
    this.entries.delete(key);
    const revision = this.revision;
    return next.handle().pipe(tap((value: unknown) => {
      // A read started before a mutation must not repopulate the cache afterward.
      if (revision !== this.revision) return;
      if (this.entries.size >= 100) {
        const oldest = this.entries.keys().next().value;
        if (oldest !== undefined) this.entries.delete(oldest);
      }
      this.entries.set(key, { value, expires: Date.now() + 30000 });
    }));
  }

  onModuleDestroy() {
    this.subscription.unsubscribe();
    this.entries.clear();
  }
}
