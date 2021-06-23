import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { ResignedEmployeesResponse } from './models';
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
    test('should get parent for provided employee id', () => {
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
});
