import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EmployeesRequest, FilterDimension } from '../shared/models';
import {
  ExitEntryEmployeesResponse,
  OpenApplication,
  OverviewWorkforceBalanceMeta,
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

      const response = {} as OverviewWorkforceBalanceMeta;

      service.getOverviewWorkforceBalanceMeta(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/overview-workforce-balance-meta?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=123%7C456`
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
        synchronizedOn: '123',
      };
      const request: Partial<EmployeesRequest> = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: 'ABC123',
      };

      service.getResignedEmployees(request).subscribe((response) => {
        expect(response).toEqual(mock.employees);
      });

      const req = httpMock.expectOne(
        `api/v1/resigned-employees?dimension=${FilterDimension.ORG_UNIT}&value=${request.value}`
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
