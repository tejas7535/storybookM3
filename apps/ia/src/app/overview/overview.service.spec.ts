import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { OpenApplication, ResignedEmployeesResponse } from './models';
import { RecruitmentSource } from './models/recruitment-source.enum';
import { OverviewService } from './overview.service';

describe('OverviewService', () => {
  let httpMock: HttpTestingController;
  let service: OverviewService;
  let spectator: SpectatorService<OverviewService>;

  const createService = createServiceFactory({
    service: OverviewService,
    imports: [HttpClientTestingModule],
    providers: [
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

  describe('getResignedEmployees', () => {
    test('should get reisgned employees', () => {
      const mock: ResignedEmployeesResponse = {
        employees: [],
      };
      const orgUnit = 'ABC123';

      service.getResignedEmployees(orgUnit).subscribe((response) => {
        expect(response).toEqual(mock.employees);
      });

      const req = httpMock.expectOne(`/resigned-employees?org_unit=${orgUnit}`);
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
          recruitmentSources: [RecruitmentSource.EXTERNAL],
        } as OpenApplication,
      ];
      const orgUnit = 'ABC123';

      service.getOpenApplications(orgUnit).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`/open-applications?org_unit=${orgUnit}`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
