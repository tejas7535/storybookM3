import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

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

  describe('getIotThings', () => {
    test('should call GET for given path', () => {
      const mockIotThingID = '123';
      const mock = 'mockData';

      service.getIotThings<string>(mockIotThingID).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/iot/things/${mockIotThingID}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
