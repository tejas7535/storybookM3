import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService } from '@schaeffler/http';
import { IAGGREGATIONTYPE } from '../../shared/models';

import { IotParams, RestService } from './rest.service';

describe('Rest Service', () => {
  let service: RestService;
  let spectator: SpectatorService<RestService>;
  let dataService: DataService;

  const createService = createServiceFactory({
    service: RestService,
    imports: [HttpClientTestingModule],
    providers: [
      RestService,
      {
        provide: DataService,
        useValue: {
          getAll: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    dataService = spectator.inject(DataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getIot', () => {
    it('should call DataService getAll method for given path', () => {
      const mockPath = 'many/paths/should/be/handled';

      service.getIot(mockPath);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockPath}`,
        undefined
      );
    });
  });

  describe('getBearing', () => {
    it('should call DataService getAll with bearingId and metadata route', () => {
      const mockBearingId = '123';

      service.getBearing(mockBearingId);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockBearingId}`,
        undefined
      );
    });
  });

  describe('getEdm', () => {
    it('should call DataService getAll with all edm params', () => {
      const mockEdmDevice = {
        id: 'ich1-bin2-top3',
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      service.getEdm(mockEdmDevice);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockEdmDevice.id}/sensors/electric-discharge/telemetry`,
        {
          params: {
            start: mockEdmDevice.startDate.toString(),
            end: mockEdmDevice.endDate.toString(),
            aggregation: IAGGREGATIONTYPE.AVG,
            timebucketSeconds: '-1',
          },
        }
      );
    });
  });

  describe('getGreaseStatus', () => {
    it('should call dataService getAll with all grease params', () => {
      const mockGreaseDevice = {
        id: 'du1-bist2-flop3',
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      service.getGreaseStatus(mockGreaseDevice);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockGreaseDevice.id}/sensors/grease-status/telemetry`,
        {
          params: {
            start: mockGreaseDevice.startDate.toString(),
            end: mockGreaseDevice.endDate.toString(),
            aggregation: undefined,
            timebucketSeconds: undefined,
          },
        }
      );
    });
  });

  describe('getGreaseStatusLatest', () => {
    it('should call dataService getShaftLatest', () => {
      const mockShaftDeviceID = '123';

      service.getShaftLatest(mockShaftDeviceID);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockShaftDeviceID}/sensors/rotation-speed/telemetry`,
        undefined
      );
    });
  });

  describe('getShaftLatest', () => {
    it('should call dataService getAll with all grease params', () => {
      const mockBearingId = '123';

      service.getGreaseStatusLatest(mockBearingId);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockBearingId}/sensors/grease-status/telemetry`,
        undefined
      );
    });
  });

  describe('getDevices', () => {
    it('should call GET for given path', () => {
      service.getDevices();
      expect(dataService.getAll).toHaveBeenCalledWith(`device/listedgedevices`);
    });
  });

  describe('getBearingLoad', () => {
    it('should call dataService getLoad', () => {
      const mockLoadSenseParams = {
        id: 'du1-bist2-flop3',
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      service.getBearingLoad(mockLoadSenseParams);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockLoadSenseParams.id}/sensors/bearing-load/telemetry`,
        {
          params: {
            start: mockLoadSenseParams.startDate.toString(),
            end: mockLoadSenseParams.endDate.toString(),
            timebucketSeconds: '3600',
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
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${deviceId}/sensors/bearing-load/telemetry`,
        undefined
      );
    });
  });

  describe('getBearingLoadAverage', () => {
    it('should call dataService', () => {
      const deviceId = 'du1-bist2-flop3';
      const startDate = 610_952_400;
      const endDate = 610_952_401;

      const iotParams: IotParams = {
        id: deviceId,
        startDate,
        endDate,
      };

      service.getBearingLoadAverage(iotParams);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${deviceId}/sensors/bearing-load/telemetry`,
        {
          params: {
            start: startDate.toString(),
            end: endDate.toString(),
            timebucketSeconds: '-1',
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
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
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
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };
      service.getCenterLoad(mockDataParams);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockDataParams.id}/analytics/center-load`,
        {
          params: {
            start: mockDataParams.startDate.toString(),
            end: mockDataParams.endDate.toString(),
            timebucketSeconds: '0',
            aggregation: IAGGREGATIONTYPE.AVG,
          },
        }
      );
    });
  });
  describe('getStaticSafety', () => {
    it('should call GET for center-load', () => {
      service.getStaticSafety('FooID');
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/FooID/analytics/static-safety-factor`,
        undefined
      );
    });
  });
  describe('getShaft', () => {
    it('should call GET for shaft', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };
      service.getShaft(mockDataParams);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `things/${mockDataParams.id}/sensors/rotation-speed/telemetry`,
        {
          params: {
            start: mockDataParams.startDate.toString(),
            end: mockDataParams.endDate.toString(),
            timebucketSeconds: '3600',
            aggregation: IAGGREGATIONTYPE.AVG,
          },
        }
      );
    });
  });
});
