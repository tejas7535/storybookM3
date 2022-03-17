import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { Slice, SortDirection } from '../shared/models';
import { AttritionAnalyticsService } from './attrition-analytics.service';
import {
  EmployeeAnalytics,
  FeatureImportanceGroup,
  FeatureImportanceType,
  FeatureParams,
} from './models';

describe('AttritionAnalyticsService', () => {
  let httpMock: HttpTestingController;
  let service: AttritionAnalyticsService;
  let spectator: SpectatorService<AttritionAnalyticsService>;

  const createService = createServiceFactory({
    service: AttritionAnalyticsService,
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

  describe('getAvailableFeatures', () => {
    test('should get available features', () => {
      const mock: FeatureParams[] = [];
      service.getAvailableFeatures().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`api/v1/available-features`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getEmployeeAnalytics', () => {
    test('should get employee analytics', () => {
      const mock: EmployeeAnalytics[] = [];
      const param: FeatureParams[] = [
        { feature: 'Age', region: 'Nebrasca', year: 2021, month: 11 },
      ];
      service.getEmployeeAnalytics(param).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`api/v1/employee-analytics`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(param);
      req.flush(mock);
    });
  });

  describe('getFeatureImportance', () => {
    test('should get feature importance', () => {
      const mock: Slice<FeatureImportanceGroup> = {
        hasNext: true,
        hasPrevious: false,
        pageable: {
          pageNumber: 0,
          pageSize: 10,
        },
        content: [
          {
            feature: 'Test',
            type: FeatureImportanceType.NUMERIC,
            dataPoints: [
              {
                shapValue: 1,
                value: 'test a',
                yaxisPos: 18,
                colorMap: 0.3,
              },
            ],
          },
        ],
      };
      const region = 'Test';
      const year = 2022;
      const month = 8;
      const page = 0;
      const size = 10;
      const sortProperty = 'max_y_post';
      const sortDirection = SortDirection.DESC;
      service
        .getFeatureImportance(
          region,
          year,
          month,
          page,
          size,
          sortProperty,
          sortDirection
        )
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(
        `api/v1/feature-importance?region=${region}&year=${year}&month=${month}&page=${page}&size=${size}&sort=${sortProperty},${sortDirection}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
