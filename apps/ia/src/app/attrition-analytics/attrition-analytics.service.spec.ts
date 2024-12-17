import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EmployeesRequest, FilterDimension } from '../shared/models';
import { AttritionAnalyticsService } from './attrition-analytics.service';
import { EmployeeCluster } from './models';

describe('AttritionAnalyticsService', () => {
  let httpMock: HttpTestingController;
  let service: AttritionAnalyticsService;
  let spectator: SpectatorService<AttritionAnalyticsService>;
  const employeeRequest: EmployeesRequest = {
    filterDimension: FilterDimension.BOARD,
    value: 'Test',
    timeRange: '123|321',
  };

  const createService = createServiceFactory({
    service: AttritionAnalyticsService,
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailableClusters', () => {
    test('should get available clusters', () => {
      const mock: EmployeeCluster[] = [];
      service.getAvailableClusters().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`api/v1/available-clusters`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getEmployeeAnalytics', () => {
    test('should get employee analytics', () => {
      const employeeRequestWithCluster = {
        ...employeeRequest,
        cluster: 'Test',
      };
      const mock: EmployeeCluster[] = [];
      service
        .getEmployeeAnalytics(employeeRequestWithCluster)
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(
        `api/v1/employee-analytics?dimension=BOARD&value=Test&time_range=123%7C321&cluster=Test`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
