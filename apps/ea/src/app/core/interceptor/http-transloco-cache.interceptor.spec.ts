import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';

import { of } from 'rxjs';

import { createHttpFactory, SpectatorHttp } from '@ngneat/spectator/jest';

import { TranslocoCacheInterceptor } from './http-transloco-cache.interceptor';

describe('TranslocoCacheInterceptor', () => {
  let spectator: SpectatorHttp<TranslocoCacheInterceptor>;
  const createHttp = createHttpFactory({
    service: TranslocoCacheInterceptor,
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TranslocoCacheInterceptor,
        multi: true,
      },
    ],
  });

  beforeEach(() => {
    spectator = createHttp();
  });

  it('should add a timestamp query parameter to translation file URLs', () => {
    const url = '/assets/i18n/en.json';
    spectator.service.intercept(new HttpRequest('GET', url), {
      handle: jest.fn().mockImplementation((req: HttpRequest<any>) => {
        expect(req.url).toMatch(/\/assets\/i18n\/en\.json\?v=\d+/);

        return of(undefined);
      }),
    } as any);
  });

  it('should not modify non-translation file URLs', () => {
    const url = '/api/data';
    spectator.service.intercept(new HttpRequest('GET', url), {
      handle: jest.fn().mockImplementation((req: HttpRequest<any>) => {
        expect(req.url).toBe(url);

        return of(undefined);
      }),
    } as any);
  });
});
