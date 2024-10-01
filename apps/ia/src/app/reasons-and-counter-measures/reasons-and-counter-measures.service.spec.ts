import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EmployeesRequest, FilterDimension } from '../shared/models';
import { ReasonForLeavingStats } from './models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from './reasons-and-counter-measures.service';

describe('ReasonsAndCounterMeasuresService', () => {
  let httpMock: HttpTestingController;
  let service: ReasonsAndCounterMeasuresService;
  let spectator: SpectatorService<ReasonsAndCounterMeasuresService>;

  const createService = createServiceFactory({
    service: ReasonsAndCounterMeasuresService,
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

  describe('getReasonsWhyPeopleLeft', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler1';
      const timeRange = '123-321';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      const response = [] as ReasonForLeavingStats[];

      service.getReasonsWhyPeopleLeft(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/reasons-why-people-left?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });

  describe('getLeaversByReason', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler1';
      const timeRange = '123-321';
      const reasonId = 1;
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
        reasonId,
      } as EmployeesRequest;

      const response = [] as ReasonForLeavingStats[];

      service.getLeaversByReason(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/reasons-leavers?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}&reason_id=${reasonId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });
});
