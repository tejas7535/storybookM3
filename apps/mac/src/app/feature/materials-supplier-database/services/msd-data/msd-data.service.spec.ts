import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';

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

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MsdDataService', () => {
  let spectator: SpectatorService<MsdDataService>;
  let service: MsdDataService;
  let httpMock: HttpTestingController;

  const translatePrefix = 'materialsSupplierDatabase.';

  const createService = createServiceFactory({
    service: MsdDataService,
    imports: [HttpClientTestingModule, provideTranslocoTestingModule({ en })],
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
      const mockResponse = ['st'];
      const expected = [
        { id: 'st', title: `${translatePrefix}materialClassValues.st` },
      ];
      service.getMaterialClasses().subscribe((result: any) => {
        expect(result).toEqual(expected);
        expect(translate).toHaveBeenCalledWith(
          `${translatePrefix}materialClassValues.st`
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
      const mockResponse = ['strip'];
      const expected = [
        {
          id: 'strip',
          title: `${translatePrefix}productCategoryValues.strip`,
        },
      ];
      service.getProductCategories().subscribe((result: any) => {
        expect(result).toEqual(expected);
        expect(translate).toHaveBeenCalledWith(
          `${translatePrefix}productCategoryValues.strip`
        );
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/productCategories`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
  describe('getMaterials', () => {
    const mockResponse: MaterialResponseEntry[] = [
      {
        id: 127,
        castingMode: undefined,
        castingDiameter: undefined,
        minDimension: 0,
        maxDimension: 0,
        co2PerTon: 2183,
        rating: 'RSI',
        steelMakingProcess: 'BF + BOF',
        releaseDateYear: 2021,
        releaseDateMonth: 10,
        releaseRestrictions: '',
        productCategory: 'strip',
        materialClass: 'st',
        manufacturerSupplier: {
          id: 442,
          name: 'ArcelorMittal Tubarao',
          plant: 'Tubarao',
          sapData: [
            {
              sapSupplierId: '0000000000000',
            },
            {
              sapSupplierId: '0000000000001',
            },
          ],
        },
        materialStandard: {
          id: 57,
          materialName: 'C80M',
          standardDocument: 'S 130002',
          materialNumber: '1.1234',
        },
      },
      {
        id: 128,
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
        productCategory: 'strip',
        materialClass: 'st',
        manufacturerSupplier: {
          id: 442,
          name: 'ArcelorMittal Tubarao',
          plant: 'Tubarao',
        },
        materialStandard: {
          id: 57,
          materialName: 'C45',
          standardDocument: 'S 130001',
          materialNumber: '1.1234, 1.2345',
        },
      },
    ];

    const mockResult: DataResult[] = [
      {
        id: 127,
        manufacturerSupplierId: 442,
        manufacturerSupplierName: 'ArcelorMittal Tubarao',
        manufacturerSupplierPlant: 'Tubarao',
        sapSupplierIds: ['0000000000000', '0000000000001'],
        materialStandardId: 57,
        materialStandardMaterialName: 'C80M',
        materialStandardStandardDocument: 'S 130002',
        materialClass: 'st',
        materialClassText: 'materialsSupplierDatabase.materialClassValues.st',
        productCategory: 'strip',
        productCategoryText:
          'materialsSupplierDatabase.productCategoryValues.strip',
        minDimension: 0,
        maxDimension: 0,
        co2PerTon: 2183,
        castingMode: undefined,
        castingDiameter: undefined,
        rating: 'RSI',
        steelMakingProcess: 'BF + BOF',
        releaseDateYear: 2021,
        releaseDateMonth: 10,
        releaseRestrictions: '',
        materialNumbers: ['1.1234'],
        co2Scope1: undefined,
        co2Scope2: undefined,
        co2Scope3: undefined,
        ratingRemark: undefined,
        referenceDoc: undefined,
      } as DataResult,
      {
        id: 128,
        manufacturerSupplierId: 442,
        manufacturerSupplierName: 'ArcelorMittal Tubarao',
        manufacturerSupplierPlant: 'Tubarao',
        sapSupplierIds: [],
        materialStandardId: 57,
        materialStandardMaterialName: 'C45',
        materialStandardStandardDocument: 'S 130001',
        materialClass: 'st',
        materialClassText: 'materialsSupplierDatabase.materialClassValues.st',
        productCategory: 'strip',
        productCategoryText:
          'materialsSupplierDatabase.productCategoryValues.strip',
        minDimension: 0,
        maxDimension: 0,
        co2PerTon: 2183,
        steelMakingProcess: 'BF + BOF',
        releaseDateYear: 2004,
        releaseDateMonth: 6,
        releaseRestrictions: '',
        castingDiameter: undefined,
        castingMode: undefined,
        co2Scope1: undefined,
        co2Scope2: undefined,
        co2Scope3: undefined,
        ratingRemark: undefined,
        referenceDoc: undefined,
        materialNumbers: ['1.1234', '1.2345'],
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
      service
        .getMaterials('st', [undefined, 'strip'])
        .subscribe((result: any) => {
          expect(result).toEqual(mockResult);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials?materialClass=st&category=strip`
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
        `${service['BASE_URL']}/materials/manufacturerSuppliers`
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
        `${service['BASE_URL']}/materials/materialStandards`
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
        `${service['BASE_URL']}/materials/ratings`
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
        `${service['BASE_URL']}/materials/steelMakingProcesses`
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
      ];
      service.fetchCo2Classifications().subscribe((result) => {
        expect(result).toEqual(expected);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/co2Classifications`
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
        `${service['BASE_URL']}/materials/castingModes`
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

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('fetchCastingDiameters', () => {
    it('should post a query for the casting diameters', (done) => {
      const mockResponse = ['diameter'];
      const expectedBody = {
        select: ['castingDiameter'],
        where: [
          {
            col: 'manufacturerSupplier.id',
            op: 'IN',
            values: ['1'],
          },
          {
            col: 'castingMode',
            op: 'LIKE',
            values: ['ingot'],
          },
        ],
        distinct: true,
      };
      service.fetchCastingDiameters(1, 'ingot').subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/query`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });
});
