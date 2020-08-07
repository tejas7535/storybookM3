import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import {
  BOM_MOCK,
  CALCULATIONS_TYPE_MOCK,
  REFRENCE_TYPE_MOCK,
} from '../../../testing/mocks';
import { ENV_CONFIG } from '../../core/http/environment-config.interface';
import {
  BomIdentifier,
  BomResult,
  ReferenceTypeIdentifier,
  ReferenceTypeResultModel,
} from '../../core/store/reducers/detail/models';
import { CalculationsResultModel } from '../../core/store/reducers/detail/models/calculations-result-model';
import { DetailService } from './detail.service';

describe('DetailService', () => {
  let service: DetailService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DetailService,
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
  });

  beforeEach(() => {
    service = TestBed.inject(DetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getDetails', () => {
    test('should get detail result', () => {
      const mock = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);
      const expectedParams = new HttpParams()
        .set('material_number', mock.referenceTypeDto.materialNumber)
        .set('plant', mock.referenceTypeDto.plant);

      service
        .getDetails(
          new ReferenceTypeIdentifier(
            mock.referenceTypeDto.materialNumber,
            mock.referenceTypeDto.plant
          )
        )
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(`/detail?${expectedParams.toString()}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params).toEqual(expectedParams);
      req.flush(mock);
    });

    test('should include RFQ info if provided', () => {
      const mock = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);
      const expectedParams = new HttpParams()
        .set('material_number', mock.referenceTypeDto.materialNumber)
        .set('plant', mock.referenceTypeDto.plant)
        .set('rfq', mock.referenceTypeDto.rfq)
        .set(
          'pcm_calculation_date',
          String(mock.referenceTypeDto.pcmCalculationDate)
        )
        .set('pcm_quantity', String(mock.referenceTypeDto.pcmQuantity));

      service
        .getDetails(
          new ReferenceTypeIdentifier(
            mock.referenceTypeDto.materialNumber,
            mock.referenceTypeDto.plant,
            mock.referenceTypeDto.rfq,
            mock.referenceTypeDto.pcmCalculationDate,
            mock.referenceTypeDto.pcmQuantity
          )
        )
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(`/detail?${expectedParams.toString()}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params).toEqual(expectedParams);
      req.flush(mock);
    });
  });

  describe('calculations', () => {
    test('should get calculations result', () => {
      const mock = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);

      service.calculations('').subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/calculations?material_number=');
      expect(req.request.method).toBe('GET');
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
        `/bom?bom_costing_date=${bomIdentifier.bomCostingDate}&bom_costing_number=${bomIdentifier.bomCostingNumber}&bom_costing_type=${bomIdentifier.bomCostingType}&bom_costing_version=${bomIdentifier.bomCostingVersion}&bom_entered_manually=${bomIdentifier.bomEnteredManually}&bom_reference_object=${bomIdentifier.bomReferenceObject}&bom_valuation_variant=${bomIdentifier.bomValuationVariant}`
      );
      expect(req.request.method).toBe('GET');
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
