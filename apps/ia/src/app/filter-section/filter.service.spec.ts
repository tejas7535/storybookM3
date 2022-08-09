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

  describe('getRegions', () => {
    test('should get regions', () => {
      const data: IdValue[] = [];

      service.getRegions().subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(`api/v1/filters/regions`);

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSubRegions', () => {
    test('should get sub-regions', () => {
      const data: IdValue[] = [];

      service.getSubRegions().subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(`api/v1/filters/sub-regions`);

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getCountries', () => {
    test('should get countries', () => {
      const data: IdValue[] = [];

      service.getCountries().subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(`api/v1/filters/countries`);

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSubFunctions', () => {
    test('should get sub-functions', () => {
      const data: IdValue[] = [];

      service.getSubFunctions().subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(`api/v1/filters/sub-functions`);

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });
});
