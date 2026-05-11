import { Injectable } from '@nestjs/common';
import { interval, map, merge, Observable, Subject } from 'rxjs';

export type RealtimeResource =
  | 'blogs'
  | 'categories'
  | 'products'
  | 'contacts'
  | 'seo'
  | 'site-settings'
  | 'system';

export type RealtimeAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'regenerated'
  | 'connected'
  | 'heartbeat';

export type RealtimeEvent = {
  resource: RealtimeResource;
  action: RealtimeAction;
  message: string;
  timestamp: string;
};

@Injectable()
export class RealtimeService {
  private readonly eventsSubject = new Subject<RealtimeEvent>();

  events(): Observable<{ data: RealtimeEvent }> {
    const heartbeat$ = interval(30000).pipe(
      map(() => ({
        data: this.createEvent('system', 'heartbeat', 'Realtime connection is active'),
      })),
    );

    const updates$ = this.eventsSubject.asObservable().pipe(map((event) => ({ data: event })));

    return merge(
      new Observable<{ data: RealtimeEvent }>((subscriber) => {
        subscriber.next({
          data: this.createEvent('system', 'connected', 'Realtime connection established'),
        });
        subscriber.complete();
      }),
      heartbeat$,
      updates$,
    );
  }

  publish(resource: RealtimeResource, action: RealtimeAction, message: string) {
    this.eventsSubject.next(this.createEvent(resource, action, message));
  }

  private createEvent(
    resource: RealtimeResource,
    action: RealtimeAction,
    message: string,
  ): RealtimeEvent {
    return {
      resource,
      action,
      message,
      timestamp: new Date().toISOString(),
    };
  }
}
