import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models/api-version.enum';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { CalculationService } from './calculation.service';

describe('CalculationService', () => {
  let service: CalculationService;
  let spectator: SpectatorService<CalculationService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CalculationService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getQuotationKpiCalculation', () => {
    test('should get calculations', () => {
      const requestBody = {
        detailKpiList: [
          {
            materialNumber15: '1233432432',
            quantity: 5,
            netValue: 12,
            gpi: 3,
            gpm: 2,
            rfqDataGpm: 11,
            priceDiff: 23,
            gqRating: 1,
          },
        ],
      };
      const mockResponse = {
        totalNetValue: 12,
        totalWeightedAverageGpi: 2,
        totalWeightedAverageGpm: 4,
        totalWeightedAveragePriceDiff: 2,
        amountOfQuotationDetails: 12,
        avgGqRating: 2,
      };

      service
        .getQuotationKpiCalculation(requestBody)
        .subscribe((res) => expect(res).toEqual(mockResponse));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_CALCULATION']}/${service['PATH_QUOTATION_DETAILS_KPI']}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(mockResponse);
    });
  });
});
