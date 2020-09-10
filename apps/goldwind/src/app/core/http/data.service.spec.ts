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

  describe('getIot', () => {
    test('should call GET for given path', () => {
      const mockPath = 'many/paths/should/be/handled';
      const mock = 'mockData';

      service.getIot(mockPath).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`${BASE_URL}/iot/things/${mockPath}`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getBearing', () => {
    test('should call GET for given path', () => {
      const mockBearingId = '123';
      const mock = 'mockThing';

      service.getBearing(mockBearingId).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/iot/things/${mockBearingId}/metadata`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getEdm', () => {
    test('should call GET for given path', () => {
      const mockEdmID = 'ich1-bin2-top3';
      const mock = 'mockMeasurements';

      service.getEdm(mockEdmID).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`${BASE_URL}/iot/things/${mockEdmID}/edm`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getGreaseStatus', () => {
    test('should call GET for given path', () => {
      const mockGreaseSensorId = 'du1-bist2-flop3';
      const mock = 'mockGreaseStatus';

      service.getGreaseStatus(mockGreaseSensorId).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/iot/things/${mockGreaseSensorId}/greasecheck`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getDevices', () => {
    test('should call GET for given path', () => {
      const mock = 'mockDevices';

      service.getDevices().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`${BASE_URL}/device/listedgedevices`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
