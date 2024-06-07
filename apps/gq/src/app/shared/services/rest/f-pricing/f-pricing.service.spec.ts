import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiVersion, ProductType } from '@gq/shared/models';
import {
  FPricingCalculationsRequest,
  UpdateFPricingDataRequest,
  UpdateFPricingDataResponse,
} from '@gq/shared/models/f-pricing';
import { MaterialComparisonResponse } from '@gq/shared/models/f-pricing/material-comparison.interface';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import {
  MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK,
  MARKET_VALUE_DRIVERS_MOCK,
} from '../../../../../testing/mocks/models/fpricing/market-value-drivers.mock';
import { MARKET_VALUE_DRIVERS_SELECTIONS_MOCK } from '../../../../../testing/mocks/models/fpricing/market-value-drivers-selections.mock';
import { FPricingPaths } from './f-pricing.paths.enum';
import { FPricingService } from './f-pricing.service';

describe('FPricingService', () => {
  let spectator: SpectatorService<FPricingService>;
  let service: FPricingService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: FPricingService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFPricingData', () => {
    test('should call GET', () => {
      const gqPositionId = '1234';
      service
        .getFPricingData(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${FPricingPaths.PATH_QUOTATION_DETAILS}/${gqPositionId}/${FPricingPaths.PATH_F_PRICING}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(gqPositionId);
    });

    test('should map marketValueDrivers', () => {
      const response = MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK;
      service
        .getFPricingData('1234')
        .subscribe((res) => expect(res).toEqual(MARKET_VALUE_DRIVERS_MOCK));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${FPricingPaths.PATH_QUOTATION_DETAILS}/1234/${FPricingPaths.PATH_F_PRICING}`
      );
      req.flush(response);
    });
  });

  describe('getComparableTransactions', () => {
    test('should call GET', () => {
      const gqPositionId = '1234';
      service
        .getComparableTransactions(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${FPricingPaths.PATH_QUOTATION_DETAILS}/${gqPositionId}/${FPricingPaths.PATH_F_PRICING}/${FPricingPaths.PATH_COMPARABLE_K_NUMBER_TRANSACTIONS}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('getFPricingCalculations', () => {
    test('should call POST', () => {
      const data = {
        referencePrice: 100,
        relativeMvdSurcharge: 0.8,
        relativeTvdSurcharge: 0.5,
        sanityCheck: {},
      } as FPricingCalculationsRequest;

      service
        .getFPricingCalculations(data)
        .subscribe((res) => expect(res).toEqual(data));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${FPricingPaths.PATH_F_PRICING}/${FPricingPaths.PATH_F_PRICING_CALCULATIONS}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(data);
    });
  });
  describe('updateFPricingData', () => {
    test('should call POST', () => {
      const gqPositionId = '1234';
      const data: UpdateFPricingDataRequest = {
        marketValueDriverSelections: MARKET_VALUE_DRIVERS_SELECTIONS_MOCK,
        finalPrice: 1500,
      };

      const response: UpdateFPricingDataResponse = {
        gqPositionId,
        marketValueDriverSelections: data.marketValueDriverSelections,
        finalPrice: 1500,
      };

      service
        .updateFPricingData(gqPositionId, data)
        .subscribe((res) => expect(res).toEqual(response));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${FPricingPaths.PATH_QUOTATION_DETAILS}/${gqPositionId}/${FPricingPaths.PATH_F_PRICING}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(gqPositionId);
    });
  });
  describe('getComparisonMaterialInformation', () => {
    test('should call GET', () => {
      const productType: ProductType = ProductType.CRB;
      const material = '12345';
      const materialToCompare = '45678';
      const response: MaterialComparisonResponse = {
        items: [],
      };
      const params: HttpParams = new HttpParams()
        .set('product-type', productType)
        .set('compare', [material, materialToCompare].join(','));

      service
        .getComparisonMaterialInformation(
          productType,
          material,
          materialToCompare
        )
        .subscribe((res) => expect(res).toEqual(response));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${FPricingPaths.PATH_F_PRICING}/${FPricingPaths.PATH_F_PRICING_FEATURE_COMPARISON}?${params.toString()}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });
});
