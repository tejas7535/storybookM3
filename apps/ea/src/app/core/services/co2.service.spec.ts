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
import { CO2Service } from './co2.service';

describe('CO2Service', () => {
  let co2Service: CO2Service;
  let spectator: SpectatorService<CO2Service>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CO2Service,
    imports: [HttpClientTestingModule],
    providers: [CO2Service],
  });

  beforeEach(() => {
    spectator = createService();
    co2Service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(co2Service).toBeDefined();
  });

  describe('createModel', () => {
    it('should call the service to create a model', waitForAsync(() => {
      const url = `${environment.baseUrl}/CO2Calculator.WebApi/v1.3/co2calculator/create?designation=abc`;
      const mockResult = 'my-result';

      firstValueFrom(co2Service.createModel('abc')).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResult);
    }));
  });

  describe('updateModel', () => {
    it('should call the service to update the model', waitForAsync(() => {
      const url = `${environment.baseUrl}/CO2Calculator.WebApi/v1.3/co2calculator/my-id/update`;

      firstValueFrom(
        co2Service.updateModel(
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

  describe('calculateModel', () => {
    it('should call the service to calculate the model', waitForAsync(() => {
      const url = `${environment.baseUrl}/CO2Calculator.WebApi/v1.3/co2calculator/my-id/calculate`;
      const mockResult = 'my-calculationid';

      firstValueFrom(co2Service.calculateModel('my-id')).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));
  });

  describe('getCalculationResult', () => {
    it('should call the service to get the calculation result', waitForAsync(() => {
      const url = `${environment.baseUrl}/CO2Calculator.WebApi/v1.3/co2calculator/my-id/output/my-calcid`;
      const mockResult = 'my-result';

      firstValueFrom(
        co2Service.getCalculationResult('my-id', 'my-calcid')
      ).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));

    it('should handle retries gracefully', waitForAsync(() => {
      const url = `${environment.baseUrl}/CO2Calculator.WebApi/v1.3/co2calculator/my-id/output/my-calcid`;
      const mockResult = 'my-result';

      firstValueFrom(
        co2Service.getCalculationResult('my-id', 'my-calcid')
      ).then((res) => {
        expect(res).toEqual(mockResult);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult, { status: 204, statusText: 'still calculating' });
    }));

    it('should handle true errors gracefully', waitForAsync(() => {
      const url = `${environment.baseUrl}/CO2Calculator.WebApi/v1.3/co2calculator/my-id/output/my-calcid`;
      const mockResult = 'my-result';

      firstValueFrom(co2Service.getCalculationResult('my-id', 'my-calcid'))
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
