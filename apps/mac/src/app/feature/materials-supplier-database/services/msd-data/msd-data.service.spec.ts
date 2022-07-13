import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TranslocoService } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import {
  DataResult,
  ManufacturerSupplier,
  Material,
  MaterialResponseEntry,
  MaterialStandard,
} from '../../models';
import { MsdDataService } from './msd-data.service';

describe('MsdDataService', () => {
  let spectator: SpectatorService<MsdDataService>;
  let service: MsdDataService;
  let httpMock: HttpTestingController;

  const translatePrefix = 'materialsSupplierDatabase.';

  const createService = createServiceFactory({
    service: MsdDataService,
    imports: [HttpClientTestingModule, provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn((value) => value),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdDataService);
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMaterialClasses', () => {
    it('should return a list of material classes', (done) => {
      const mockResponse = [{ id: 0, name: 'gibts net', code: 'gn' }];
      const expected = [
        { id: 0, name: `${translatePrefix}materialClassValues.gn`, code: 'gn' },
      ];
      service.getMaterialClasses().subscribe((result: any) => {
        expect(result).toEqual(expected);
        expect(service['translocoService'].translate).toHaveBeenCalledWith(
          `${translatePrefix}materialClassValues.gn`
        );
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/materialClasses`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
  describe('getProductCategories', () => {
    it('should return a list of product categories', (done) => {
      const mockResponse = [{ id: 0, name: 'gibts net', code: 'gn' }];
      const expected = [
        {
          id: 0,
          name: `${translatePrefix}productCategoryValues.gn`,
          code: 'gn',
        },
      ];
      service.getProductCategories().subscribe((result: any) => {
        expect(result).toEqual(expected);
        expect(service['translocoService'].translate).toHaveBeenCalledWith(
          `${translatePrefix}productCategoryValues.gn`
        );
        done();
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
          sapData: [
            {
              id: 1,
              manufacturerSupplierId: 442,
              name: 'ArcelorMittal Tubarao',
              plant: 'Tubarao',
              sapSupplierId: '0000000000000',
              sapSupplierName: 'ArcelorMittal Tubarao',
              sapSupplierLocation: 'Tubarao',
              sapSupplierCountry: 'some country',
              sapCategory: 'M020',
            },
            {
              id: 2,
              manufacturerSupplierId: 442,
              name: 'ArcelorMittal Tubarao',
              plant: 'Tubarao',
              sapSupplierId: '0000000000001',
              sapSupplierName: 'ArcelorMittal Tubarao',
              sapSupplierLocation: 'Tubarao',
              sapSupplierCountry: 'some country',
              sapCategory: 'M020',
            },
          ],
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
          kind: 1,
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
        manufacturerSupplierKind: 'Supplier',
        sapSupplierIds: ['0000000000000', '0000000000001'],
        materialStandardId: 57,
        materialStandardMaterialName: 'C80M',
        materialStandardStandardDocument: 'S 130002',
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
        manufacturerSupplierKind: 'Manufacturer',
        sapSupplierIds: [],
        materialStandardId: 11,
        materialStandardMaterialName: 'DC03',
        materialStandardStandardDocument: 'not existing doc',
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

    it('should request the full table if no input is defined', (done) => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      service.getMaterials(undefined, undefined).subscribe((result: any) => {
        expect(result).toEqual(mockResult);
        done();
      });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should request the given scope if inputs are defined', (done) => {
      service.getMaterials(2, [undefined, 1]).subscribe((result: any) => {
        expect(result).toEqual(mockResult);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials?materialClass=2&shape=1`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should request only null values if flag is set', (done) => {
      service.getMaterials(2, [undefined]).subscribe((result: any) => {
        expect(result).toEqual(mockResult);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials?materialClass=2`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchManufacturerSuppliers', () => {
    it('should return a list of manufacturer suppliers', (done) => {
      const mockResponse: ManufacturerSupplier[] = [
        {
          id: 0,
          name: 'supplier1',
          plant: 'plant1',
          sapData: [{ sapSupplierId: '123456' }, { sapSupplierId: '1234567' }],
        },
        {
          id: 1,
          name: 'supplier2',
          plant: 'plant2',
        },
      ];
      service.fetchManufacturerSuppliers().subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_V2']}/materials/manufacturerSuppliers`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchMaterialStandards', () => {
    it('should return a list of material standards', (done) => {
      const mockResponse: MaterialStandard[] = [
        {
          id: 0,
          materialName: 'material1',
          materialNumber: '1234.1234',
          standardDocument: 'S 123456',
        },
        {
          id: 1,
          materialName: 'material1',
          materialNumber: '1234.1234',
          standardDocument: 'S 123456',
        },
      ];
      service.fetchMaterialStandards().subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_V2']}/materials/materialStandards`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchRatings', () => {
    it('should return a list of ratings', (done) => {
      const mockResponse: string[] = ['good', 'gooder', 'goodest'];
      service.fetchRatings().subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_V2']}/materials/ratings`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchSteelMakingProcesses', () => {
    it('should return a list of steel making processes', (done) => {
      const mockResponse: string[] = [
        'hitting it with a hammer',
        'bend it like bender',
      ];
      service.fetchSteelMakingProcesses().subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_V2']}/materials/steelMakingProcesses`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchCo2Classifications', () => {
    it('should return a list of co2 classifications', (done) => {
      const mockResponse: string[] = ['invented', 'guessed', 'dice roll'];
      const expected: StringOption[] = [
        {
          id: 'invented',
          title:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.invented',
        },
        {
          id: 'guessed',
          title:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.guessed',
        },
        {
          id: 'dice roll',
          title:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.dice roll',
        },
        {
          id: undefined,
          title:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.none',
        },
      ];
      service.fetchCo2Classifications().subscribe((result) => {
        expect(result).toEqual(expected);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_V2']}/materials/co2Classifications`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchCastingModes', () => {
    it('should return a list of casting modes', (done) => {
      const mockResponse: string[] = ['dsds', 'popstars'];
      service.fetchCastingModes().subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_V2']}/materials/castingModes`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createMaterial', () => {
    it('should post a material', (done) => {
      const mockResponse = { id: 1 };
      service.createMaterial({} as Material).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${service['BASE_URL_V2']}/materials`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
});
