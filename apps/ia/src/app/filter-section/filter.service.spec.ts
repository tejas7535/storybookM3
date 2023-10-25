import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { FilterDimension, IdValue, Slice } from '../shared/models';
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

  describe('getHrLocations', () => {
    test('should get regions', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getHrLocations(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/hr-locations?time_range=${encodeURIComponent(
          timeRange
        )}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getPersonalAreas', () => {
    test('should get regions', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getPersonalAreas(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/personal-areas?time_range=${encodeURIComponent(
          timeRange
        )}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getRegions', () => {
    test('should get regions', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getRegions(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/regions?time_range=${encodeURIComponent(timeRange)}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSubRegions', () => {
    test('should get sub-regions', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getSubRegions(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/sub-regions?time_range=${encodeURIComponent(timeRange)}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getCountries', () => {
    test('should get countries', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getCountries(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/countries?time_range=${encodeURIComponent(timeRange)}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getFunctions', () => {
    test('should get sub-functions', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getFunctions(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/functions?time_range=${timeRange}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSubFunctions', () => {
    test('should get sub-functions', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getSubFunctions(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/sub-functions?time_range=${timeRange}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSegments', () => {
    test('should get segments', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getSegments(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/segments?time_range=${timeRange}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSubSegments', () => {
    test('should get sub-segments', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getSubSegments(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/sub-segments?time_range=${timeRange}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSegmentUnits', () => {
    test('should get segment units', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getSegmentUnits(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/segment-units?time_range=${timeRange}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getBoards', () => {
    test('should get segment units', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getBoards(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/boards?time_range=${timeRange}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getSubBoards', () => {
    test('should get sub-boards', () => {
      const data: IdValue[] = [];
      const timeRange = '1-1';

      service.getSubBoards(timeRange).subscribe((response) => {
        expect(response).toEqual(data);
      });

      const req = httpMock.expectOne(
        `api/v1/filters/sub-boards?time_range=${timeRange}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('getDataForFilterDimension', () => {
    test('should return org units', () => {
      const searchFor = 't1';
      const timeRange = '123';
      const expectedResult = of();
      service.getOrgUnits = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(
        FilterDimension.ORG_UNIT,
        searchFor,
        timeRange
      );

      expect(result).toEqual(expectedResult);
      expect(service.getOrgUnits).toHaveBeenCalledWith(searchFor, timeRange);
    });

    test('should return regions', () => {
      const expectedResult = of();
      service.getRegions = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(FilterDimension.REGION);

      expect(result).toEqual(expectedResult);
      expect(service.getRegions).toHaveBeenCalled();
    });

    test('should return sub-regions', () => {
      const expectedResult = of();
      service.getSubRegions = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(
        FilterDimension.SUB_REGION
      );

      expect(result).toEqual(expectedResult);
      expect(service.getSubRegions).toHaveBeenCalled();
    });

    test('should return countries', () => {
      const expectedResult = of();
      service.getCountries = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(FilterDimension.COUNTRY);

      expect(result).toEqual(expectedResult);
      expect(service.getCountries).toHaveBeenCalled();
    });

    test('should return sub-functions', () => {
      const expectedResult = of();
      service.getSubFunctions = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(
        FilterDimension.SUB_FUNCTION
      );

      expect(result).toEqual(expectedResult);
      expect(service.getSubFunctions).toHaveBeenCalled();
    });
  });
});
