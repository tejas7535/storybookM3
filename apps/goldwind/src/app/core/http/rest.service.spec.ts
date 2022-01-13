import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../../environments/environment';
import { IAGGREGATIONTYPE } from '../../shared/models';

import { RestService } from './rest.service';

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

  describe('getEdmHistogram', () => {
    it('should call DataService getAll with all edm histogram params', () => {
      const mockEdmDevice = {
        id: 'windpark_device_1',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };

      service.getEdmHistogram(mockEdmDevice);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/analyse/dashboard/${mockEdmDevice.id}/edm/histogram`,
        {
          params: {
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
        `${apiUrl}/analyse/maintenance/${req_params.deviceId}/gcm/heatmap`,
        {
          params: {
            start: String(expectedyearStart),
            end: String(expectedyearEnd),
          },
        }
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

  describe('getCenterLoad', () => {
    it('should call GET for center-load', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      service.getCenterLoad(mockDataParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/analyse/loadassesment/${mockDataParams.id}/centerload`,
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

  describe('getMaintenaceSensors', () => {
    it('should call api GET endpoint', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      service.getMaintenaceSensors(mockDataParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/analyse/maintenance/${mockDataParams.id}/sensors`,
        {
          params: {
            start: mockDataParams.start,
            end: mockDataParams.end,
          },
        }
      );
    });
  });

  describe('getLoadAssessmentDistribution', () => {
    it('should call api GET endpoint', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      service.getLoadAssessmentDistribution(mockDataParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/analyse/loadassessment/${mockDataParams.id}/runchart`,
        {
          params: {
            start: mockDataParams.start,
            end: mockDataParams.end,
          },
        }
      );
    });
  });
  describe('getBearingLoadDistribution', () => {
    it('should call api GET endpoint', () => {
      const mockDataParams = {
        id: 'du1-bist2-flop3',
        start: 1_599_651_508,
        end: 1_599_651_509,
      };
      service.getBearingLoadDistribution(mockDataParams);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/analyse/loadassessment/${mockDataParams.id}/distribution`,
        {
          params: {
            start: mockDataParams.start,
            end: mockDataParams.end,
          },
        }
      );
    });
  });
});
