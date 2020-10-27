import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService } from './data.service';
import { ENV_CONFIG } from './environment-config.interface';

describe('Data Service', () => {
  const BASE_URL = 'http://localhost:8080';
  let service: DataService;
  let spectator: SpectatorService<DataService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: DataService,
    imports: [HttpClientTestingModule],
    providers: [
      DataService,
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: BASE_URL,
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    test('should call GET for given path - with http params', () => {
      const serviceName = 'get-all';
      const mock = 'mockData';
      const params = new HttpParams().set('test', '123');

      service
        .getAll<string>(serviceName, { params })
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(`${BASE_URL}/${serviceName}?test=123`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params).toEqual(params);
      req.flush(mock);
    });

    test('should call GET for given path - without http params', () => {
      const serviceName = 'get-all';
      const mock = 'mockData';

      service.getAll<string>(serviceName).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`${BASE_URL}/${serviceName}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params).toEqual(new HttpParams());
      req.flush(mock);
    });
  });

  describe('post', () => {
    test('should call POST for given path and data', () => {
      const serviceName = 'post-item';
      const mock = 'mockData';
      const body = { test: 'test' };

      service.post<string>(serviceName, body).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`${BASE_URL}/${serviceName}`);
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });
});
