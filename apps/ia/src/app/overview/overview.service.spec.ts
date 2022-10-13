import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { EmployeesRequest, FilterDimension } from '../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationRatesChartData,
  OpenApplication,
  OverviewFluctuationRates,
  ResignedEmployeesResponse,
} from './models';
import { OverviewService } from './overview.service';

describe('OverviewService', () => {
  let httpMock: HttpTestingController;
  let service: OverviewService;
  let spectator: SpectatorService<OverviewService>;

  const createService = createServiceFactory({
    service: OverviewService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getOverviewFluctuationRates', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123|456';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      const response = {} as OverviewFluctuationRates;

      service.getOverviewFluctuationRates(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/overview-fluctuation-rates?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=123%7C456`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });

  describe('getFluctuationRateChartData', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler12';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
      } as EmployeesRequest;

      const response = {} as FluctuationRatesChartData;

      service.getFluctuationRateChartData(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/fluctuation-rates-chart?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });

  describe('getResignedEmployees', () => {
    test('should get resigned employees', () => {
      const mock: ResignedEmployeesResponse = {
        employees: [],
        resignedEmployeesCount: 5,
        responseModified: true,
      };
      const orgUnit = 'ABC123';

      service
        .getResignedEmployees(FilterDimension.ORG_UNIT, orgUnit)
        .subscribe((response) => {
          expect(response).toEqual(mock.employees);
        });

      const req = httpMock.expectOne(
        `api/v1/resigned-employees?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getOpenApplications', () => {
    test('should get open applications', () => {
      const mock: OpenApplication[] = [
        {
          count: 3,
          name: 'Developer',
          approvalDate: '123',
          isExternal: true,
          isInternal: false,
        } as OpenApplication,
      ];
      const request = {
        filterDimension: FilterDimension.COUNTRY,
        value: 'PL',
      } as EmployeesRequest;

      service.getOpenApplications(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/open-applications?dimension=${request.filterDimension}&value=${request.value}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getOverviewExitEmployees', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123|456';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      const response = {} as ExitEntryEmployeesResponse;

      service.getOverviewExitEmployees(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/overview-exit-employees?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=123%7C456`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });

  describe('getOverviewEntryEmployees', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123|456';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      const response = {} as ExitEntryEmployeesResponse;

      service.getOverviewEntryEmployees(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/overview-entry-employees?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=123%7C456`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });

  describe('getOpenPositionsCount', () => {
    test('should get open positions count', () => {
      const orgUnit = 'Schaeffler12';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
      } as EmployeesRequest;
      const mock = 31;

      service.getOpenApplicationsCount(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/open-positions-count?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getAttritionOverTimeEmployees', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123|456';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      const response = {} as ExitEntryEmployeesResponse;

      service.getAttritionOverTimeEmployees(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/overview-attrition-over-time-employees?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=123%7C456`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });
});
