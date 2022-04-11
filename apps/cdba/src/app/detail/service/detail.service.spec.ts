import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BomIdentifier, ReferenceTypeIdentifier } from '@cdba/shared/models';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import {
  BOM_MOCK,
  CALCULATIONS_MOCK,
  DRAWINGS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';
import { withCache } from '@ngneat/cashew';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import {
  BomResult,
  CalculationsResponse,
} from '../../core/store/reducers/detail/models';
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
      const mock = new BomResult(BOM_MOCK);
      const bomIdentifier = new BomIdentifier(
        '20200604',
        'number',
        'type',
        'version',
        'yes',
        'ref',
        'var'
      );

      service.getBom(bomIdentifier).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/bom?bom_costing_date=${bomIdentifier.bomCostingDate}&bom_costing_number=${bomIdentifier.bomCostingNumber}&bom_costing_type=${bomIdentifier.bomCostingType}&bom_costing_version=${bomIdentifier.bomCostingVersion}&bom_entered_manually=${bomIdentifier.bomEnteredManually}&bom_reference_object=${bomIdentifier.bomReferenceObject}&bom_valuation_variant=${bomIdentifier.bomValuationVariant}`
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
