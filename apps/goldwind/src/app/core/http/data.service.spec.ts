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
      const mockEdmDevice = {
        id: 'ich1-bin2-top3',
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const mock = 'mockMeasurements';

      service.getEdm(mockEdmDevice).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/iot/things/${mockEdmDevice.id}/edm/${mockEdmDevice.startDate}/${mockEdmDevice.endDate}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getGreaseStatus', () => {
    test('should call GET for given path', () => {
      const mockGreaseDevice = {
        id: 'du1-bist2-flop3',
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const mock = 'mockGreaseStatus';

      service.getGreaseStatus(mockGreaseDevice).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/iot/things/${mockGreaseDevice.id}/greasecheck/${mockGreaseDevice.startDate}/${mockGreaseDevice.endDate}`
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
