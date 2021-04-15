import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService } from '@schaeffler/http';

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

  describe('getIot', () => {
    test('should call DataService getAll method for given path', () => {
      const mockPath = 'many/paths/should/be/handled';

      service.getIot(mockPath);
      expect(dataService.getAll).toHaveBeenCalledWith(`iot/things/${mockPath}`);
    });
  });

  describe('getBearing', () => {
    test('should call DataService getAll with bearingId and metadata route', () => {
      const mockBearingId = '123';

      service.getBearing(mockBearingId);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockBearingId}/`
      );
    });
  });

  describe('getEdm', () => {
    test('should call DataService getAll with all edm params', () => {
      const mockEdmDevice = {
        id: 'ich1-bin2-top3',
        startDate: 1599651508,
        endDate: 1599651509,
      };

      service.getEdm(mockEdmDevice);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockEdmDevice.id}/telemetry/electric-discharge/${mockEdmDevice.startDate}/${mockEdmDevice.endDate}`
      );
    });
  });

  describe('getGreaseStatus', () => {
    test('should call dataService getAll with all grease params', () => {
      const mockGreaseDevice = {
        id: 'du1-bist2-flop3',
        startDate: 1599651508,
        endDate: 1599651509,
      };

      service.getGreaseStatus(mockGreaseDevice);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockGreaseDevice.id}/telemetry/grease-status/${mockGreaseDevice.startDate}/${mockGreaseDevice.endDate}`
      );
    });
  });

  describe('getGreaseStatusLatest', () => {
    test('should call dataService getShaftLatest', () => {
      const mockShaftDeviceID = '123';

      service.getShaftLatest(mockShaftDeviceID);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockShaftDeviceID}/telemetry/rotation-speed/latest`
      );
    });
  });

  describe('getShaftLatest', () => {
    test('should call dataService getAll with all grease params', () => {
      const mockBearingId = '123';

      service.getGreaseStatusLatest(mockBearingId);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockBearingId}/telemetry/grease-status/latest`
      );
    });
  });

  describe('getDevices', () => {
    test('should call GET for given path', () => {
      service.getDevices();
      expect(dataService.getAll).toHaveBeenCalledWith(`device/listedgedevices`);
    });
  });

  describe('getBearingLoad', () => {
    test('should call dataService getLoad', () => {
      const mockLoadSenseParams = {
        id: 'du1-bist2-flop3',
        startDate: 1599651508,
        endDate: 1599651509,
      };

      service.getBearingLoad(mockLoadSenseParams);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockLoadSenseParams.id}/telemetry/bearing-load/${mockLoadSenseParams.startDate}/${mockLoadSenseParams.endDate}`
      );
    });
  });

  describe('getBearingLoadLatest', () => {
    test('should call dataService', () => {
      const deviceId = 'du1-bist2-flop3';

      service.getBearingLoadLatest(deviceId);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${deviceId}/telemetry/bearing-load/latest`
      );
    });
  });

  describe('getBearingLoadAverage', () => {
    test('should call dataService', () => {
      const deviceId = 'du1-bist2-flop3';
      const startDate = 123;
      const endDate = 456;

      const iotParams: IotParams = {
        id: deviceId,
        startDate,
        endDate,
      };

      service.getBearingLoadAverage(iotParams);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${deviceId}/sensors/bearing-load/telemetry?agg=avg&end=${endDate}&start=${startDate}`
      );
    });
  });

  describe('getData', () => {
    test('should call GET for given path', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const mockData = [
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          actualValue: 1635.0,
          minValue: 1700.0,
          maxValue: 1900.0,
        },
      ];

      service.getData(mockDataParams).subscribe((response) => {
        expect(response).toEqual(mockData);
      });
    });
  });
});
