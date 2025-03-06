import { HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';

import { TranslocoService } from '@jsverse/transloco';
import { environment } from '@lsa/environments/environment';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { LSALanguageInterceptor } from './language.interceptor';

describe('HttpCO2UpstreamInterceptor', () => {
  let spectator: SpectatorService<LSALanguageInterceptor>;
  let interceptor: LSALanguageInterceptor;
  let next: HttpHandler;

  const createService = createServiceFactory({
    service: LSALanguageInterceptor,
    providers: [
      mockProvider(TranslocoService, {
        getActiveLang: jest.fn(() => 'de'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.inject(LSALanguageInterceptor);
    next = {
      handle: jest.fn(),
    } as HttpHandler;
  });

  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should to nothing to non LSA upstream urls', () => {
      const req = {
        url: 'not co2 upstream url',
        method: 'POST',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        clone: jest.fn(),
      } as unknown as HttpRequest<any>;

      interceptor.intercept(req, next);

      expect(req.clone).not.toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalledWith(req);
    });

    it('should set the headers for LSA backend requests', () => {
      const expectedReq = {
        url: environment.lsaApiBaseUrl,
        method: 'POST',
        headers: new HttpHeaders(),
      } as unknown as HttpRequest<any>;

      const req = {
        url: environment.lsaApiBaseUrl,
        method: 'POST',
        headers: new HttpHeaders(),
        clone: jest.fn(() => expectedReq),
      } as unknown as HttpRequest<any>;

      interceptor.intercept(req, next);

      expect(req.clone).toHaveBeenCalledWith({
        headers: req.headers.set('X-LSA-Language', 'de'),
      });
      expect(next.handle).toHaveBeenCalledWith(expectedReq);
    });
  });
});
