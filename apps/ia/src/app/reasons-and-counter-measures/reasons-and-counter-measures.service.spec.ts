import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';

import { EmployeesRequest } from '../shared/models';
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
      const request = { orgUnit, timeRange } as unknown as EmployeesRequest;

      const response = [] as ReasonForLeavingStats[];

      service.getReasonsWhyPeopleLeft(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/reasons-why-people-left?org_unit_key=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });
});
