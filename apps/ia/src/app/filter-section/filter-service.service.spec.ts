import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { InitialFiltersResponse } from '../shared/models';
import { FilterService } from './filter-service.service';

describe('FilterService', () => {
  let httpMock: HttpTestingController;
  let service: FilterService;
  let spectator: SpectatorService<FilterService>;

  const createService = createServiceFactory({
    service: FilterService,
    imports: [HttpClientTestingModule],
    providers: [
      FilterService,
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

  describe('getInitialFilters', () => {
    test('should get initial filters', () => {
      const mock: InitialFiltersResponse =
        {} as unknown as InitialFiltersResponse;

      service.getInitialFilters().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/initial-filters');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
