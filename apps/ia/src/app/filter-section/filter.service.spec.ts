import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { FilterService } from './filter.service';
import { InitialFiltersResponse } from './models/initial-filters-response.model';

describe('FilterService', () => {
  let httpMock: HttpTestingController;
  let service: FilterService;
  let spectator: SpectatorService<FilterService>;

  const createService = createServiceFactory({
    service: FilterService,
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

  describe('getInitialFilters', () => {
    test('should get initial filters', () => {
      const mock: InitialFiltersResponse =
        {} as unknown as InitialFiltersResponse;

      service.getInitialFilters().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('api/v1/initial-filters');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
