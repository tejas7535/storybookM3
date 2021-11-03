import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { AttritionAnalyticsService } from './attrition-analytics.service';
import { EmployeeAnalytics } from './models/employee-analytics.model';
import { FeatureParams } from './models/feature-params.model';

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
});
