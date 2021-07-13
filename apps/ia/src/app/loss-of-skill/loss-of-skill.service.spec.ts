import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { EmployeesRequest } from '../shared/models';
import { LossOfSkillService } from './loss-of-skill.service';
import { LostJobProfile } from './models';

describe('LossOfSkillService', () => {
  let httpMock: HttpTestingController;
  let service: LossOfSkillService;
  let spectator: SpectatorService<LossOfSkillService>;

  const createService = createServiceFactory({
    service: LossOfSkillService,
    imports: [HttpClientTestingModule],
    providers: [
      LossOfSkillService,
      DataService,
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
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

  describe('getLostJobProfiles', () => {
    test('should get lost job profiles', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123-321';
      const request = { orgUnit, timeRange } as unknown as EmployeesRequest;
      const mock: LostJobProfile[] = [{ job: 'Manager' } as LostJobProfile];

      service.getLostJobProfiles(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `/lost-job-profiles?org_unit=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
