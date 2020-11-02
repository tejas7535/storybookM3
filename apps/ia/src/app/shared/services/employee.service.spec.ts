import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { InitialFiltersResponse } from '../models';
import { EmployeeService } from './employee.service';

describe('EmployeesService', () => {
  let httpMock: HttpTestingController;

  let service: EmployeeService;
  let spectator: SpectatorService<EmployeeService>;

  const createService = createServiceFactory({
    service: EmployeeService,
    imports: [HttpClientTestingModule],
    providers: [
      EmployeeService,
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

  describe('getInitialFilters', () => {
    test('should get initial filters', () => {
      const mock: InitialFiltersResponse = ({} as unknown) as InitialFiltersResponse;

      service.getInitialFilters().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/initial-filters');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
