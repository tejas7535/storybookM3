import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService } from '@schaeffler/http';

import { environment } from '../../../environments/environment';
import { IAGGREGATIONTYPE } from '../../shared/models';
import { IotParams, RestService } from './rest.service';

describe('Rest Service', () => {
  let service: RestService;
  let httpClient: HttpClient;
  let spectator: SpectatorService<RestService>;
  const apiUrl = environment.baseUrl;

  const createService = createServiceFactory({
    service: RestService,
    imports: [HttpClientTestingModule],
    providers: [
      RestService,
      {
        provide: HttpClient,
        useValue: {
          get: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    spectator = createService();
    service = spectator.service;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBearing', () => {
    it('should call DataService getAll with bearingId and metadata route', () => {
      const mockBearingId = '123';

      service.getBearing(mockBearingId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockBearingId}`
      );
    });
  });

  describe('getEdm', () => {
    it('should call DataService getAll with all edm params', () => {
      const mockEdmDevice = {
        id: 'ich1-bin2-top3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };

      service.getEdm(mockEdmDevice);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockEdmDevice.id}/sensors/electric-discharge/telemetry`,
        {
          params: {
            start: mockEdmDevice.start,
            end: mockEdmDevice.end,
            aggregation: IAGGREGATIONTYPE.AVG,
            timebucketSeconds: -1,
          },
        }
      );
    });
  });
  describe('getEdmHistogram', () => {
    it('should call DataService getAll with all edm histogram params', () => {
      const mockEdmDevice = {
        id: 'windpark_device_1',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };

      service.getEdmHistogram(mockEdmDevice, 'edm-1');
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockEdmDevice.id}/analytics/histogram`,
        {
          params: {
            channel: 'edm-1',
            start: mockEdmDevice.start,
            end: mockEdmDevice.end,
          },
        }
      );
    });
  });

  describe('getGreaseHeatMap', () => {
    it('should call DataService getAll with all edm histogram params', () => {
      const req_params = {
        deviceId: 'windpark_device_1',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      const expectedStart = new Date(req_params.start * 1000).getFullYear();
      const expectedyearStart = Date.parse(`${expectedStart}-01-01`) / 1000;
      const expectedyearEnd = Date.parse(`${expectedStart}-12-31`) / 1000;

      service.getGreaseHeatMap(req_params);

      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${req_params.deviceId}/analytics/heatmap`,
        {
          params: {
            start: String(expectedyearStart),
            end: String(expectedyearEnd),
          },
        }
      );
    });
  });

  describe('getGreaseStatus', () => {
    it('should call dataService getAll with all grease params', () => {
      const mockGreaseDevice = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };

      service.getGreaseStatus(mockGreaseDevice);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockGreaseDevice.id}/sensors/grease-status/telemetry`,
        {
          params: {
            start: mockGreaseDevice.start,
            end: mockGreaseDevice.end,
          },
        }
      );
    });
  });

  describe('getGreaseStatusLatest', () => {
    it('should call dataService getShaftLatest', () => {
      const mockShaftDeviceID = '123';

      service.getShaftLatest(mockShaftDeviceID);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockShaftDeviceID}/sensors/rotation-speed/telemetry`
      );
    });
  });

  describe('getShaftLatest', () => {
    it('should call dataService getAll with all grease params', () => {
      const mockBearingId = '123';

      service.getGreaseStatusLatest(mockBearingId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockBearingId}/sensors/grease-status/telemetry`
      );
    });
  });

  describe('getDevices', () => {
    it('should call GET for given path', () => {
      service.getDevices();
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/device/listedgedevices`
      );
    });
  });

  describe('getBearingLoad', () => {
    it('should call dataService getLoad', () => {
      const mockLoadSenseParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };

      service.getBearingLoad(mockLoadSenseParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockLoadSenseParams.id}/sensors/bearing-load/telemetry`,
        {
          params: {
            start: mockLoadSenseParams.start,
            end: mockLoadSenseParams.end,
            timebucketSeconds: -1,
            aggregation: IAGGREGATIONTYPE.AVG,
          },
        }
      );
    });
  });

  describe('getBearingLoadLatest', () => {
    it('should call dataService', () => {
      const deviceId = 'du1-bist2-flop3';

      service.getBearingLoadLatest(deviceId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${deviceId}/sensors/bearing-load/telemetry`
      );
    });
  });

  describe('getBearingLoadAverage', () => {
    it('should call dataService', () => {
      const deviceId = 'du1-bist2-flop3';
      const start = 610_952_400;
      const end = 610_952_401;

      const iotParams: IotParams = {
        id: deviceId,
        start,
        end,
      };

      service.getBearingLoadAverage(iotParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${deviceId}/sensors/bearing-load/telemetry`,
        {
          params: {
            start,
            end,
            timebucketSeconds: -1,
            aggregation: IAGGREGATIONTYPE.AVG,
          },
        }
      );
    });
  });

  describe('getData', () => {
    it('should call GET for given path', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      const mockData = [
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          actualValue: 1635,
          minValue: 1700,
          maxValue: 1900,
        },
      ];

      service.getData(mockDataParams).subscribe((response) => {
        expect(response).toEqual(mockData);
      });
    });
  });

  describe('getCenterLoad', () => {
    it('should call GET for center-load', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      service.getCenterLoad(mockDataParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockDataParams.id}/analytics/center-load`,
        {
          params: {
            start: mockDataParams.start,
            end: mockDataParams.end,
            timebucketSeconds: 0,
            aggregation: IAGGREGATIONTYPE.AVG,
          },
        }
      );
    });
  });

  describe('getStaticSafety', () => {
    it('should call GET for static safety', () => {
      service.getStaticSafety('FooID');
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/FooID/analytics/static-safety-factor`
      );
    });
  });

  describe('getShaft', () => {
    it('should call GET for shaft', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      service.getShaft(mockDataParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockDataParams.id}/sensors/rotation-speed/telemetry`,
        {
          params: {
            start: mockDataParams.start,
            end: mockDataParams.end,
            timebucketSeconds: 3600,
            aggregation: IAGGREGATIONTYPE.AVG,
          },
        }
      );
    });
  });

  describe('getLoadDistribution', () => {
    it('should call GET for getLoadDistribution', () => {
      const deviceId = 'mockDeviceId';
      service.getLoadDistribution(deviceId, 1);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${deviceId}/analytics/load-distribution`,
        { params: { row: ['1'] } }
      );
    });
  });

  describe('getLoadDistributionAverage', () => {
    it('should call GET for getLoadDistributionAverage', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
        row: 2,
      };
      service.getLoadDistributionAverage(mockDataParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/things/${mockDataParams.id}/analytics/load-distribution`,
        {
          params: {
            aggregation: IAGGREGATIONTYPE.AVG,
            end: mockDataParams.end,
            row: 2,
            start: mockDataParams.start,
          },
        }
      );
    });
  });
});
