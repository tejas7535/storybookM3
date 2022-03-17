import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { IdValue, Slice } from '../shared/models';
import { FilterService } from './filter.service';

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

  describe('getOrgUnits', () => {
    test('should get org units', () => {
      const mock: Slice<IdValue> = {
        content: [],
        hasNext: false,
        hasPrevious: false,
        pageable: {
          pageNumber: 0,
          pageSize: 10,
        },
      };
      const searchFor = 'search';
      const timeRange = '123|456';

      service.getOrgUnits(searchFor, timeRange).subscribe((response) => {
        expect(response).toEqual(mock.content);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/org-units?time_range=${encodeURIComponent(
          timeRange
        )}&search_for=${searchFor}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
