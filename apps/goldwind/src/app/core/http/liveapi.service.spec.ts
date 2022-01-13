import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../../environments/environment';
import { LiveAPIService } from './liveapi.service';

describe('Live API Service', () => {
  let service: LiveAPIService;
  let httpClient: HttpClient;
  let spectator: SpectatorService<LiveAPIService>;
  const apiUrl = environment.baseUrl;
  const deviceId = 'bioshock';

  const createService = createServiceFactory({
    service: LiveAPIService,
    imports: [HttpClientTestingModule],
    providers: [
      LiveAPIService,
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

  describe('getGcmProcessed', () => {
    it('should call api GET endpoint', () => {
      service.getGcmProcessed(deviceId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/live/gcm/${deviceId}/data`
      );
    });
  });
  describe('getLoadDistribution', () => {
    it('should call api GET endpoint', () => {
      service.getLoadDistribution(deviceId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/live/analytics/${deviceId}/load-distribution`
      );
    });
  });
  describe('getLspStrainProcessed', () => {
    it('should call api GET endpoint', () => {
      service.getLspStrainProcessed(deviceId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/live/lspstrain/${deviceId}/data`
      );
    });
  });
  describe('getRSMShaft', () => {
    it('should call api GET endpoint', () => {
      service.getRSMShaft(deviceId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/live/rsmshaft/${deviceId}/data`
      );
    });
  });
  describe('getStaticSafetyFactor', () => {
    it('should call api GET endpoint', () => {
      service.getStaticSafetyFactor(deviceId);
      expect(httpClient.get).toHaveBeenCalledWith(
        `${apiUrl}/live/analytics/${deviceId}/static-safety-factor`
      );
    });
  });
});
