import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CalculationModuleInfoService } from './calculation-module-info.service';

describe('calculationModuleInfoService', () => {
  let calculationModuleInfoService: CalculationModuleInfoService;
  let spectator: SpectatorService<CalculationModuleInfoService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CalculationModuleInfoService,
    imports: [HttpClientTestingModule],
    providers: [CalculationModuleInfoService],
  });

  beforeEach(() => {
    spectator = createService();
    calculationModuleInfoService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(calculationModuleInfoService).toBeDefined();
  });

  describe('getCalculationInfo', () => {
    it('should call the service to get possible calculations for given bearing', waitForAsync(() => {
      const url = `${environment.calculationModuleInfoApiBaseUrl}/v1/CalculationModuleInfo/module-info?designation=abc`;
      const mockResult = {
        catalogueCalculation: true,
        frictionCalculation: false,
      };

      firstValueFrom(
        calculationModuleInfoService.getCalculationInfo('abc')
      ).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      // eslint-disable-next-line unicorn/no-null
      expect(req.request.body).toEqual(null);
      req.flush(mockResult);
    }));

    it('should throw if no bearing designation is provided', () =>
      expect(
        firstValueFrom(
          calculationModuleInfoService.getCalculationInfo(undefined)
        )
      ).rejects.toThrow());
  });
});
