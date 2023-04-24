import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { CO2UpstreamService } from './co2-upstream.service';

describe('CO2UpstreamService', () => {
  let co2UpstreamService: CO2UpstreamService;
  let spectator: SpectatorService<CO2UpstreamService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CO2UpstreamService,
    imports: [HttpClientTestingModule],
    providers: [CO2UpstreamService],
  });

  beforeEach(() => {
    spectator = createService();
    co2UpstreamService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(co2UpstreamService).toBeDefined();
  });

  describe('getCO2UpstreamForDesignation', () => {
    it('should call the service to co2 upstream for a given designation', waitForAsync(() => {
      const url = `${environment.co2UpstreamApiBaseUrl}/v1/public/upstreamForDesignation`;
      const mockResult = { id: 'my-id' };

      firstValueFrom(
        co2UpstreamService.getCO2UpstreamForDesignation('abc')
      ).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(
        expect.objectContaining({
          designation: 'abc',
        })
      );
      req.flush(mockResult);
    }));

    it('should throw if no bearing designation is provided', () =>
      expect(
        firstValueFrom(
          co2UpstreamService.getCO2UpstreamForDesignation(undefined)
        )
      ).rejects.toThrow());
  });
});
