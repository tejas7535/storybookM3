import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { PriceSource, SapPriceCondition } from '@gq/shared/models';
import { ApiVersion } from '@gq/shared/models/api-version.enum';
import { QuotationDetailsSimulatedKpi } from '@gq/shared/services/rest/calculation/model/quotation-details-simulated-kpi.interface';
import { QuotationDetailsSimulationKpiData } from '@gq/shared/services/rest/calculation/model/quotation-details-simulation-kpi-data.interface';
import { QuotationSimulatedKpiRequest } from '@gq/shared/services/rest/calculation/model/quotation-simulated-kpi-request.interface';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
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

  describe('getQuotationSimulationKpiCalculations', () => {
    test('should get simulated kpi calculations', () => {
      const requestBody: QuotationSimulatedKpiRequest = {
        simulatedField: ColumnFields.PRICE,
        priceSourceOption: PriceSourceOptions.GQ,
        detailKpiList: [
          {
            gqPositionId: '1234',
            priceSource: PriceSource.SAP_STANDARD,
            sapPriceCondition: SapPriceCondition.STANDARD,
            leadingSapConditionType: null,
            orderQuantity: 5,
            price: 10,
            recommendedPrice: 20,
            targetPrice: null,
            strategicPrice: null,
            relocationCost: null,
            sapPrice: 15,
            sapGrossPrice: 20,
            lastCustomerPrice: 20,
            gpc: 1.5,
            sqv: 5,
            sapPriceUnit: 1,
            priceUnit: 1,
          },
        ],
      };

      const mockResponse: QuotationDetailsSimulatedKpi = {
        results: [
          {
            gqPositionId: '1234',
            priceSource: PriceSource.GQ,
            price: 20,
            simulatedKpis: null,
          },
        ],
      };

      service
        .getQuotationSimulationKpiCalculations(requestBody)
        .subscribe((res) => expect(res).toEqual(mockResponse));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_CALCULATION']}/${service['PATH_QUOTATION_DETAILS_SIMULATED_KPI']}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(mockResponse);
    });
  });

  describe('createRequestForKpiSimulation', () => {
    test('should return request object', () => {
      const simulationData: QuotationDetailsSimulationKpiData = {
        gqId: 123,
        simulatedField: ColumnFields.PRICE,
        simulatedValue: 2,
        priceSourceOption: PriceSourceOptions.GQ,
        selectedQuotationDetails: [QUOTATION_DETAIL_MOCK],
      };

      const requestBody: QuotationSimulatedKpiRequest = {
        simulatedField: ColumnFields.PRICE,
        simulatedValue: 2,
        priceSourceOption: PriceSourceOptions.GQ,
        detailKpiList: [
          {
            gqPositionId: '5694232',
            priceSource: PriceSource.GQ,
            sapPriceCondition: SapPriceCondition.STANDARD,
            leadingSapConditionType: null,
            orderQuantity: 10,
            price: 200,
            recommendedPrice: 250,
            targetPrice: 90.55,
            strategicPrice: undefined,
            relocationCost: 24.5,
            sapPrice: 80,
            sapGrossPrice: 100,
            lastCustomerPrice: 170,
            gpc: 20,
            sqv: 30,
            sapPriceUnit: 1,
            priceUnit: 1,
          },
        ],
      };

      const result = service.createRequestForKpiSimulation(simulationData);
      expect(result).toEqual(requestBody);
    });
  });

  describe('requestBodyToHashCode', () => {
    test('should hash request body', () => {
      const requestBody = {
        name: 'Guided Quoting',
      };

      const result = service['requestBodyToHashCode'](requestBody);

      expect(result).toEqual('12262258836');
    });
  });
});
