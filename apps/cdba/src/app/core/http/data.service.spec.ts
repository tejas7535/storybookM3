import { configureTestSuite } from 'ng-bullet';

import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { ENV_CONFIG } from './environment-config.interface';

describe('Data Service', () => {
  const BASE_URL = 'http://localhost:8080';
  let service: DataService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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
  });

  beforeEach(() => {
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    test('should call GET for given path', () => {
      const serviceName = 'get-all';
      const mock = 'mockData';
      const httpParams = new HttpParams().set('test', '123');

      service.getAll<string>(serviceName, httpParams).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`${BASE_URL}/${serviceName}?test=123`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params).toEqual(httpParams);
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
