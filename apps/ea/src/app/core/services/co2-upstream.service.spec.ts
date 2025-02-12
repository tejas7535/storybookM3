import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Co2ApiSearchResult } from '../store/models';
import { CO2UpstreamService } from './co2-upstream.service';

describe('CO2UpstreamService', () => {
  let co2UpstreamService: CO2UpstreamService;
  let spectator: SpectatorService<CO2UpstreamService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CO2UpstreamService,
    imports: [],
    providers: [
      CO2UpstreamService,
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
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
      const url = `${environment.co2UpstreamApiBaseUrl}public/upstreamForDesignation/constant`;
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

  describe('findBearings', () => {
    it('should find all bearings from the api that match a given pattern', waitForAsync(() => {
      const url = `${environment.co2UpstreamApiBaseUrl}public/search/constant`;
      const searchPattern = '622';
      const mockResult: Co2ApiSearchResult[] = [
        { bearinxId: '6226', designation: '6226', epimId: '1234' },
      ];

      firstValueFrom(co2UpstreamService.findBearings(searchPattern)).then(
        (res) => expect(res).toEqual(mockResult)
      );
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(
        expect.objectContaining({ pattern: searchPattern })
      );
    }));
  });
});
