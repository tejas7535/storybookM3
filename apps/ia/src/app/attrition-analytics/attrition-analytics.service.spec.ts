import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { AttritionAnalyticsService } from './attrition-analytics.service';
import { EmployeeAnalytics } from './models/employee-analytics.model';

describe('AttritionAnalyticsService', () => {
  let httpMock: HttpTestingController;
  let service: AttritionAnalyticsService;
  let spectator: SpectatorService<AttritionAnalyticsService>;

  const createService = createServiceFactory({
    service: AttritionAnalyticsService,
    imports: [HttpClientTestingModule],
    providers: [
      AttritionAnalyticsService,
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

  describe('getEmployeeAnalytics', () => {
    test('should get employee analytics', () => {
      const mock: EmployeeAnalytics[] = [];
      service.getEmployeeAnalytics().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(`/employee-analytics`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
