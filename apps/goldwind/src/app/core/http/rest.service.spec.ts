import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService } from '@schaeffler/http';

import { RestService } from './rest.service';

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
        `iot/things/${mockBearingId}/metadata`
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
        `iot/things/${mockEdmDevice.id}/edm/${mockEdmDevice.startDate}/${mockEdmDevice.endDate}`
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
        `iot/things/${mockGreaseDevice.id}/greasecheck/${mockGreaseDevice.startDate}/${mockGreaseDevice.endDate}`
      );
    });
  });

  describe('getGreaseStatusLatest', () => {
    test('should call dataService getAll with all grease params', () => {
      const mockBearingId = '123';

      service.getGreaseStatusLatest(mockBearingId);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockBearingId}/greasecheck/latest`
      );
    });
  });

  describe('getDevices', () => {
    test('should call GET for given path', () => {
      service.getDevices();
      expect(dataService.getAll).toHaveBeenCalledWith(`device/listedgedevices`);
    });
  });

  describe('getLoad', () => {
    test('should call dataService getAll with the load params', () => {
      const mockLoadSenseParams = {
        id: 'du1-bist2-flop3',
        startDate: 1599651508,
        endDate: 1599651509,
      };

      service.getLoad(mockLoadSenseParams);
      expect(dataService.getAll).toHaveBeenCalledWith(
        `iot/things/${mockLoadSenseParams.id}/lsp/detail/${mockLoadSenseParams.startDate}/${mockLoadSenseParams.endDate}`
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
