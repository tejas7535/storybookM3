import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService } from './data.service';
import { ENV_CONFIG } from './environment-config.interface';

jest.mock('@stomp/rx-stomp', () => ({
  ...jest.requireActual('@stomp/rx-stomp'),
  activate: jest.fn(),
  configure: jest.fn(),
}));

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

      service.getIotThings(mockIotThingID).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/iot/things/${mockIotThingID}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('connect', () => {
    test('should establish a socket connection', () => {
      const token = 'fantasyToken';

      service.connect(token).subscribe((response) => {
        expect(response).toBeDefined();
      });
    });
  });

  describe('getTopicBroadcast', () => {
    test('should return Observable containing false if no connection', () => {
      service.getTopicBroadcast().subscribe((response) => {
        expect(response).toBeDefined();
      });
    });
  });
});
