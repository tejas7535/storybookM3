import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { EmployeesRequest, FilterDimension } from '../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
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
      const orgUnit = 'ABC123';

      service.getOpenApplications(orgUnit).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/open-applications?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
