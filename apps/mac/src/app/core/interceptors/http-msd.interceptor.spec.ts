import { HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';

import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';
// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';

import { HttpMSDInterceptor } from './http-msd.interceptor';

describe('HttpMSDInterceptor', () => {
  let spectator: SpectatorService<HttpMSDInterceptor>;
  let interceptor: HttpMSDInterceptor;
  let next: HttpHandler;

  const createService = createServiceFactory({
    service: HttpMSDInterceptor,
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.inject(HttpMSDInterceptor);
    next = {
      handle: jest.fn(),
    } as HttpHandler;
  });

  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should to nothing to non msd urls', () => {
      const req = {
        url: 'not msd',
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
        url: '/materials-supplier-database/api/',
        method: 'GET',
        body: {},
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        clone: jest.fn(),
      } as unknown as HttpRequest<any>;

      interceptor.intercept(req, next);

      expect(req.clone).not.toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalledWith(req);
    });

    it('should set the headers and encode the body for msd post requests', () => {
      const expectedReq = {
        url: '/materials-supplier-database/api/',
        method: 'POST',
        body: Buffer.from(JSON.stringify({ test: 'test' })).toString('base64'),
        headers: new HttpHeaders()
          .set('Target-Content-Type', 'application/json')
          .set('Content-Type', 'text/plain'),
      } as unknown as HttpRequest<any>;

      const req = {
        url: '/materials-supplier-database/api/',
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
        body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
      });
      expect(next.handle).toHaveBeenCalledWith(expectedReq);
    });

    it('should set the headers and encode the body for msd post requests with custom content type', () => {
      const expectedReq = {
        url: '/materials-supplier-database/api/',
        method: 'POST',
        body: Buffer.from(JSON.stringify({ test: 'test' })).toString('base64'),
        headers: new HttpHeaders()
          .set('Target-Content-Type', 'test')
          .set('Content-Type', 'text/plain'),
      } as unknown as HttpRequest<any>;

      const req = {
        url: '/materials-supplier-database/api/',
        method: 'POST',
        body: { test: 'test' },
        headers: new HttpHeaders({
          'Content-Type': 'test',
        }),
        clone: jest.fn(() => expectedReq),
      } as unknown as HttpRequest<any>;

      interceptor.intercept(req, next);

      expect(req.clone).toHaveBeenCalledWith({
        headers: req.headers
          .set('Target-Content-Type', 'test')
          .set('Content-Type', 'text/plain'),
        body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
      });
      expect(next.handle).toHaveBeenCalledWith(expectedReq);
    });
  });
});
