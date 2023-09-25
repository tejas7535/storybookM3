import { HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { HttpCO2UpstreamInterceptor } from './http-co2-upstream.interceptor';

describe('HttpCO2UpstreamInterceptor', () => {
  let spectator: SpectatorService<HttpCO2UpstreamInterceptor>;
  let interceptor: HttpCO2UpstreamInterceptor;
  let next: HttpHandler;

  const createService = createServiceFactory({
    service: HttpCO2UpstreamInterceptor,
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.inject(HttpCO2UpstreamInterceptor);
    next = {
      handle: jest.fn(),
    } as HttpHandler;
  });

  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should to nothing to non co2 upstream urls', () => {
      const req = {
        url: 'not co2 upstream url',
        method: 'POST',
        body: {},
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        clone: jest.fn(),
      } as unknown as HttpRequest<any>;

      interceptor.intercept(req, next);

      expect(req.clone).not.toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalledWith(req);
    });

    it('should do nothing to non post requests', () => {
      const req = {
        url: environment.co2UpstreamApiBaseUrl,
        method: 'GET',
        body: {},
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        clone: jest.fn(),
      } as unknown as HttpRequest<any>;

      interceptor.intercept(req, next);

      expect(req.clone).not.toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalledWith(req);
    });

    it('should set the headers and encode the body for co2UpstreamApi post requests', () => {
      const expectedReq = {
        url: environment.co2UpstreamApiBaseUrl,
        method: 'POST',
        body: window.btoa(JSON.stringify({ test: 'test' })),
        headers: new HttpHeaders()
          .set('Target-Content-Type', 'application/json')
          .set('Content-Type', 'text/plain'),
      } as unknown as HttpRequest<any>;

      const req = {
        url: environment.co2UpstreamApiBaseUrl,
        method: 'POST',
        body: { test: 'test' },
        headers: new HttpHeaders(),
        clone: jest.fn(() => expectedReq),
      } as unknown as HttpRequest<any>;

      interceptor.intercept(req, next);

      expect(req.clone).toHaveBeenCalledWith({
        headers: req.headers
          .set('Target-Content-Type', 'application/json')
          .set('Content-Type', 'text/plain'),
        body: window.btoa(JSON.stringify(req.body)),
      });
      expect(next.handle).toHaveBeenCalledWith(expectedReq);
    });
  });
});
