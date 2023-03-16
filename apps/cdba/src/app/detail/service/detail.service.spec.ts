import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { withCache } from '@ngneat/cashew';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import {
  BomIdentifier,
  CostComponentSplit,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import {
  BOM_IDENTIFIER_MOCK,
  BOM_MAPPED_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  DRAWINGS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';

import { CalculationsResponse } from '../../core/store/reducers/detail/models';
import { DetailService } from './detail.service';

describe('DetailService', () => {
  let spectator: SpectatorService<DetailService>;
  let service: DetailService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: DetailService,
    imports: [HttpClientTestingModule],
    providers: [mockProvider(BetaFeatureService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(DetailService);
    httpMock = spectator.inject(HttpTestingController);
  });

  describe('getDetails', () => {
    test('should get detail result', () => {
      const mock = REFERENCE_TYPE_MOCK;
      const expectedParams = new HttpParams()
        .set('material_number', mock.materialNumber)
        .set('plant', mock.plant);

      service
        .getDetails(
          new ReferenceTypeIdentifier(mock.materialNumber, mock.plant)
        )
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(
        `api/v2/detail?${expectedParams.toString()}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    });
  });

  describe('calculations', () => {
    test('should get calculations result', () => {
      const mock = new CalculationsResponse(
        CALCULATIONS_MOCK,
        EXCLUDED_CALCULATIONS_MOCK
      );

      service.getCalculations('2345', '0060').subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        'api/v2/calculations?material_number=2345&plant=0060'
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    });
  });

  describe('getBom', () => {
    test('should get bom entries', () => {
      const mock = BOM_MOCK;
      const bomIdentifier: BomIdentifier = {
        costingDate: '20200604',
        costingNumber: 'number',
        costingType: 'type',
        version: 'version',
        enteredManually: false,
        referenceObject: 'ref',
        valuationVariant: 'var',
      };

      service.getBom(bomIdentifier).subscribe((response) => {
        expect(response).toEqual(BOM_MAPPED_MOCK);
      });

      const req = httpMock.expectOne(
        `api/v2/bom?costing_date=${bomIdentifier.costingDate}&costing_number=${bomIdentifier.costingNumber}&costing_type=${bomIdentifier.costingType}&version=${bomIdentifier.version}&entered_manually=${bomIdentifier.enteredManually}&reference_object=${bomIdentifier.referenceObject}&valuation_variant=${bomIdentifier.valuationVariant}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    });
  });

  describe('getDrawings', () => {
    test('should get drawings', () => {
      const mock = DRAWINGS_MOCK;

      service.getDrawings('2345', '0061').subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        'api/v1/products/drawings?material_number=2345&plant=0061'
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    });
  });

  describe('getCostComponentSplit', () => {
    test('should get cost component split + summary', waitForAsync(() => {
      const mock = COST_COMPONENT_SPLIT_ITEMS_MOCK;
      const bomIdentifier = BOM_IDENTIFIER_MOCK;

      const expectedItems: CostComponentSplit[] = [
        ...mock,
        {
          costComponent: undefined,
          description: undefined,
          currency: 'USD',
          fixedValue: 0.5616,
          splitType: 'TOTAL',
          totalValue: 1.4686,
          variableValue: 0.907,
        },
      ];

      service.getCostComponentSplit(bomIdentifier).subscribe((response) => {
        expect(response).toEqual(expectedItems);
      });

      const req = httpMock.expectOne(
        `api/v1/cost-component-split?costing_date=${bomIdentifier.costingDate}&costing_number=${bomIdentifier.costingNumber}&costing_type=${bomIdentifier.costingType}&version=${bomIdentifier.version}&entered_manually=${bomIdentifier.enteredManually}&reference_object=${bomIdentifier.referenceObject}&valuation_variant=${bomIdentifier.valuationVariant}`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    }));
  });

  describe('defineBomTreeForAgGrid', () => {
    it('should build correct tree', () => {
      const bomItems = BOM_MOCK;

      const result = DetailService['defineBomTreeForAgGrid'](bomItems, 0);

      expect(result.length).toEqual(bomItems.length);
      expect(result[0].predecessorsInTree).toEqual(['FE-2313']);
      expect(result[1].predecessorsInTree).toEqual(['FE-2313', 'FE-2315']);
      expect(result[2].predecessorsInTree).toEqual(['FE-2313', 'FE-2315 ']);
      expect(result[3].predecessorsInTree).toEqual([
        'FE-2313',
        'FE-2315 ',
        'FE-2314',
      ]);
      expect(result[4].predecessorsInTree).toEqual(['FE-2313', 'FE-2311']);
    });
  });
});
