import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { EmployeesRequest } from '../shared/models';
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
      const request = { orgUnit, timeRange } as unknown as EmployeesRequest;
      const mock: JobProfile[] = [
        { positionDescription: 'Manager' } as JobProfile,
      ];

      service.getJobProfiles(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/job-profiles?org_unit=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
