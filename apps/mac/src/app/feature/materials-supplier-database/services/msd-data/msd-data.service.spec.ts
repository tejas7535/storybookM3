import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataResult, MaterialResponseEntry } from '../../models';
import { MsdDataService } from './msd-data.service';

describe('MsdDataService', () => {
  let spectator: SpectatorService<MsdDataService>;
  let service: MsdDataService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: MsdDataService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdDataService);
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMaterialClasses', () => {
    it('should return a list of material classes', () => {
      const mockResponse = [{ id: 0, name: 'gibts net' }];
      service.getMaterialClasses().subscribe((result: any) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/materialClasses`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
  describe('getProductCategories', () => {
    it('should return a list of material classes', () => {
      const mockResponse = [{ id: 0, name: 'gibts net' }];
      service.getProductCategories().subscribe((result: any) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/shapes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
  describe('getMaterials', () => {
    const mockResponse: MaterialResponseEntry[] = [
      {
        id: 127,
        isPrematerial: false,
        materialCategory: 'M018',
        castingMode: undefined,
        castingDiameter: undefined,
        minDimension: 0,
        maxDimension: 0,
        co2PerTon: 2183,
        rating: {
          id: 123,
          code: 'RSI240x28070',
          barDiameter: '70',
          squareDiameter: '70',
          remark: 'bar max. 160mm',
          kind: {
            id: 123,
            code: 'RSI',
            name: 'RSI',
          },
        },
        steelMakingProcess: 'BF + BOF',
        releaseDateYear: 2021,
        releaseDateMonth: 10,
        releaseRestrictions: '',
        esr: false,
        var: false,
        export: true,
        shape: { id: 5, name: 'strip', code: 'st', materials: [] },
        materialClass: { id: 1, name: 'Steel', code: 'st' },
        manufacturerSupplier: {
          id: 442,
          name: 'ArcelorMittal Tubarao',
          plant: 'Tubarao',
          kind: 0,
          materials: [],
        },
        materialStandard: {
          id: 57,
          materialName: 'C80M',
          standardDocument: 'S 130002',
          materials: [],
        },
      },
      {
        id: 128,
        isPrematerial: false,
        materialCategory: 'M018',
        castingMode: undefined,
        castingDiameter: undefined,
        minDimension: 0,
        maxDimension: 0,
        co2PerTon: 2183,
        rating: undefined,
        steelMakingProcess: 'BF + BOF',
        releaseDateYear: 2004,
        releaseDateMonth: 6,
        releaseRestrictions: '',
        esr: false,
        var: false,
        export: true,
        shape: { id: 5, name: 'strip', code: 'st', materials: [] },
        materialClass: { id: 1, name: 'Steel', code: 'st' },
        manufacturerSupplier: {
          id: 442,
          name: 'ArcelorMittal Tubarao',
          plant: 'Tubarao',
          kind: 0,
          materials: [],
        },
        materialStandard: {
          id: 11,
          materialName: 'DC03',
          standardDocument: 'not existing doc',
          materials: [],
        },
      },
    ];

    const mockResult: DataResult[] = [
      {
        id: 127,
        manufacturerSupplierId: 442,
        manufacturerSupplierName: 'ArcelorMittal Tubarao',
        manufacturerSupplierPlant: 'Tubarao',
        manufacturerSupplierKind: 0,
        materialStandardId: 57,
        materialStandardMaterialName: 'C80M',
        materialStandardMaterialNameHiddenFilter: 'C80M',
        materialStandardStandardDocument: 'S 130002',
        materialStandardStandardDocumentHiddenFilter: 'S 130002',
        isPrematerial: false,
        materialCategory: 'M018',
        materialClassId: 1,
        materialClassName: 'Steel',
        materialClassCode: 'st',
        shapeId: 5,
        shapeName: 'strip',
        shapeCode: 'st',
        minDimension: 0,
        maxDimension: 0,
        co2PerTon: 2183,
        ratingCode: 'RSI240x28070',
        ratingBarDiameter: '70',
        ratingSquareDiameter: '70',
        ratingRemark: 'bar max. 160mm',
        ratingKindCode: 'RSI',
        ratingKindName: 'RSI',
        steelMakingProcess: 'BF + BOF',
        releaseDateYear: 2021,
        releaseDateMonth: 10,
        releaseRestrictions: '',
        esr: false,
        var: false,
        export: true,
        materialNumbers: ['1.1525'],
      } as DataResult,
      {
        id: 128,
        manufacturerSupplierId: 442,
        manufacturerSupplierName: 'ArcelorMittal Tubarao',
        manufacturerSupplierPlant: 'Tubarao',
        manufacturerSupplierKind: 0,
        materialStandardId: 11,
        materialStandardMaterialName: 'DC03',
        materialStandardMaterialNameHiddenFilter: 'DC03',
        materialStandardStandardDocument: 'not existing doc',
        materialStandardStandardDocumentHiddenFilter: 'not existing doc',
        isPrematerial: false,
        materialCategory: 'M018',
        materialClassId: 1,
        materialClassName: 'Steel',
        materialClassCode: 'st',
        shapeId: 5,
        shapeName: 'strip',
        shapeCode: 'st',
        minDimension: 0,
        maxDimension: 0,
        co2PerTon: 2183,
        steelMakingProcess: 'BF + BOF',
        releaseDateYear: 2004,
        releaseDateMonth: 6,
        releaseRestrictions: '',
        esr: false,
        var: false,
        export: true,
      } as DataResult,
    ];

    it('should request the full table if no input is defined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      service.getMaterials(undefined, undefined).subscribe((result: any) => {
        expect(result).toEqual(mockResult);
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials?includeShapeNullValues=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should request the given scope if inputs are defined', () => {
      service.getMaterials(2, [undefined, 1]).subscribe((result: any) => {
        expect(result).toEqual(mockResult);
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials?materialClass=2&shape=1&includeShapeNullValues=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should request only null values if flag is set', () => {
      service.getMaterials(2, [undefined]).subscribe((result: any) => {
        expect(result).toEqual(mockResult);
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials?materialClass=2&includeShapeNullValues=true&showOnlyNullValues=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
