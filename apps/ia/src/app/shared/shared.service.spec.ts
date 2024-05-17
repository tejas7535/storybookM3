import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  EmployeesRequest,
  FilterDimension,
  MonthlyFluctuation,
  MonthlyFluctuationOverTime,
} from './models';
import { SharedService } from './shared.service';

describe('OverviewService', () => {
  let httpMock: HttpTestingController;
  let service: SharedService;
  let spectator: SpectatorService<SharedService>;

  const createService = createServiceFactory({
    service: SharedService,
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

  describe('getOverviewFluctuationRates', () => {
    test('should call rest service', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123|456';
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
        type: [
          MonthlyFluctuationOverTime.HEADCOUNTS,
          MonthlyFluctuationOverTime.UNFORCED_LEAVERS,
        ],
      } as EmployeesRequest;

      const response = {} as MonthlyFluctuation;

      service.getFluctuationRateChartData(request).subscribe((result) => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(
        `api/v1/monthly-fluctuation-over-time?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=123%7C456&type=${MonthlyFluctuationOverTime.HEADCOUNTS},${MonthlyFluctuationOverTime.UNFORCED_LEAVERS}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(request);
    });
  });
});
