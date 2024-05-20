import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EmployeesRequest, FilterDimension } from '../shared/models';
import { LossOfSkillService } from './loss-of-skill.service';
import { JobProfile } from './models';

describe('LossOfSkillService', () => {
  let httpMock: HttpTestingController;
  let service: LossOfSkillService;
  let spectator: SpectatorService<LossOfSkillService>;

  const createService = createServiceFactory({
    service: LossOfSkillService,
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

  describe('getJobProfiles', () => {
    test('should get job profiles', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123-321';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;
      const mock: JobProfile[] = [
        { positionDescription: 'Manager' } as JobProfile,
      ];

      service.getJobProfiles(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/job-profiles?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getWorkforce', () => {
    test('should get workforce', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '1-1';
      const jobKey = 'Manager';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
        jobKey,
      } as EmployeesRequest;
      const mock = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
        jobKey,
      };

      service.getWorkforce(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/workforce?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}&job_key=${jobKey}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getLeavers', () => {
    test('should get leavers', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '1-1';
      const jobKey = 'Manager';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
        jobKey,
      } as EmployeesRequest;
      const mock = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
        jobKey,
      };

      service.getLeavers(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/leavers?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}&job_key=${jobKey}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
