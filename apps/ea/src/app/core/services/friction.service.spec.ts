import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import {
  CalculationParametersEnergySource,
  CalculationParametersOperationConditions,
} from '../store/models';
import { FrictionService } from './friction.service';

describe('FrictionService', () => {
  let frictionService: FrictionService;
  let spectator: SpectatorService<FrictionService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: FrictionService,
    imports: [HttpClientTestingModule],
    providers: [FrictionService],
  });

  beforeEach(() => {
    spectator = createService();
    frictionService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(frictionService).toBeDefined();
  });

  describe('createFrictionModel', () => {
    it('should call the service to create a model', waitForAsync(() => {
      const url = `${environment.frictionApiBaseUrl}/v1.3/co2calculator/create?designation=abc`;
      const mockResult = 'my-result';

      firstValueFrom(frictionService.createFrictionModel('abc')).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResult);
    }));
  });

  describe('updateFrictionModel', () => {
    it('should call the service to update the model', waitForAsync(() => {
      const url = `${environment.frictionApiBaseUrl}/v1.3/co2calculator/my-id/update`;

      firstValueFrom(
        frictionService.updateFrictionModel(
          'my-id',
          {} as CalculationParametersOperationConditions,
          {} as CalculationParametersEnergySource
        )
      ).then((res) => {
        expect(res).toEqual({});
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    }));
  });

  describe('calculateFrictionModel', () => {
    it('should call the service to calculate the model', waitForAsync(() => {
      const url = `${environment.frictionApiBaseUrl}/v1.3/co2calculator/my-id/calculate`;
      const mockResult = 'my-calculationid';

      firstValueFrom(frictionService.calculateFrictionModel('my-id')).then(
        (res) => {
          expect(res).toEqual(mockResult);
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));
  });

  describe('getCalculationResult', () => {
    it('should call the service to get the calculation result', waitForAsync(() => {
      const url = `${environment.frictionApiBaseUrl}/v1.3/co2calculator/my-id/output/my-calcid`;
      const mockResult = 'my-result';

      firstValueFrom(
        frictionService.getCalculationResult('my-id', 'my-calcid')
      ).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));

    it('should handle retries gracefully', waitForAsync(() => {
      const url = `${environment.frictionApiBaseUrl}/v1.3/co2calculator/my-id/output/my-calcid`;
      const mockResult = 'my-result';

      firstValueFrom(
        frictionService.getCalculationResult('my-id', 'my-calcid')
      ).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult, { status: 204, statusText: 'still calculating' });
    }));

    it('should handle true errors gracefully', waitForAsync(() => {
      const url = `${environment.frictionApiBaseUrl}/v1.3/co2calculator/my-id/output/my-calcid`;
      const mockResult = 'my-result';

      firstValueFrom(frictionService.getCalculationResult('my-id', 'my-calcid'))
        .catch((error) => error)
        .then((res) => {
          expect(res).toBeInstanceOf(HttpErrorResponse);
        });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult, {
        status: 500,
        statusText: 'Internal server error',
      });
    }));
  });
});
