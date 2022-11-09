import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  DataResult,
  ManufacturerSupplier,
  Material,
  MaterialResponseEntry,
  MaterialStandard,
} from '@mac/msd/models';

import * as en from '../../../../../assets/i18n/en.json';
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
          country: 'Brazil',
          manufacturer: false,
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
        selfCertified: false,
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
          country: 'Brazil',
          manufacturer: true,
        },
        materialStandard: {
          id: 57,
          materialName: 'C45',
          standardDocument: 'S 130001',
          materialNumber: '1.1234, 1.2345',
        },
        selfCertified: false,
      },
    ];

    const mockResult: DataResult[] = [
      {
        id: 127,
        blocked: undefined,
        manufacturerSupplierId: 442,
        manufacturerSupplierName: 'ArcelorMittal Tubarao',
        manufacturerSupplierPlant: 'Tubarao',
        manufacturerSupplierCountry: 'Brazil',
        selfCertified: false,
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
        co2Classification: undefined,
        ratingRemark: undefined,
        ratingChangeComment: undefined,
        referenceDoc: undefined,
        manufacturer: false,
        lastModified: undefined,
      } as DataResult,
      {
        id: 128,
        blocked: undefined,
        manufacturerSupplierId: 442,
        manufacturerSupplierName: 'ArcelorMittal Tubarao',
        manufacturerSupplierPlant: 'Tubarao',
        manufacturerSupplierCountry: 'Brazil',
        selfCertified: false,
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
        co2Classification: undefined,
        rating: undefined,
        ratingRemark: undefined,
        ratingChangeComment: undefined,
        referenceDoc: undefined,
        materialNumbers: ['1.1234', '1.2345'],
        manufacturer: true,
        lastModified: undefined,
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
          country: 'country1',
          sapData: [{ sapSupplierId: '123456' }, { sapSupplierId: '1234567' }],
        },
        {
          id: 1,
          name: 'supplier2',
          plant: 'plant2',
          country: 'country2',
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

  describe('createMaterialStandard', () => {
    it('should post a material standard', (done) => {
      const mockResponse = { id: 1 };
      service
        .createMaterialStandard({} as MaterialStandard)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/materialStandards`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('createManufacturerSupplier', () => {
    it('should post a manufacturer supplier', (done) => {
      const mockResponse = { id: 1 };
      service
        .createManufacturerSupplier({} as ManufacturerSupplier)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/manufacturerSuppliers`
      );
      expect(req.request.method).toBe('POST');
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

  describe('fetchReferenceDocuments', () => {
    it('should post a query for the reference documents', (done) => {
      const mockResponse = ['document'];
      const expectedBody = {
        select: ['referenceDoc'],
        where: [
          {
            col: 'materialStandard.id',
            op: 'IN',
            values: ['1'],
          },
        ],
        distinct: true,
      };
      service.fetchReferenceDocuments(1).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/query`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });

  describe('fetchStandardDocumentsForMaterialName', () => {
    it('should post a query for standard documents', (done) => {
      const mockResponse = [
        [1, 'S 123456'],
        [2, 'S 654321'],
      ];
      const expectedBody = {
        select: ['materialStandard.id', 'materialStandard.standardDocument'],
        where: [
          {
            col: 'materialStandard.materialName',
            op: 'IN',
            values: ['materialName'],
          },
        ],
        distinct: true,
      };

      service
        .fetchStandardDocumentsForMaterialName('materialName')
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/query`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });

  describe('fetchMaterialNamesForStandardDocuments', () => {
    it('should post a query for material names', (done) => {
      const mockResponse = [
        [1, 'name1'],
        [2, 'name2'],
      ];
      const expectedBody = {
        select: ['materialStandard.id', 'materialStandard.materialName'],
        where: [
          {
            col: 'materialStandard.standardDocument',
            op: 'IN',
            values: ['standardDocument'],
          },
        ],
        distinct: true,
      };

      service
        .fetchMaterialNamesForStandardDocuments('standardDocument')
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/query`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });

  describe('fetchManufacturerSuppliersForSupplierName', () => {
    it('should post a query for supplier ids', (done) => {
      const mockResponse = [1, 2];
      const expectedBody = {
        select: ['manufacturerSupplier.id'],
        where: [
          {
            col: 'manufacturerSupplier.name',
            op: 'IN',
            values: ['supplier'],
          },
        ],
        distinct: true,
      };

      service
        .fetchManufacturerSuppliersForSupplierName('supplier')
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/query`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });

  describe('fetchSteelMakingProcessForSupplierPlantCastingModesCastingDiameter', () => {
    it('should return the steel making processes for the selected arguments', (done) => {
      // eslint-disable-next-line unicorn/no-null
      const mockResponse = [null, 'BF+BOF', 'Scrap+EAF'];
      const mockResult = ['BF+BOF', 'Scrap+EAF'];
      const expectedBody = {
        select: ['steelMakingProcess'],
        where: [
          {
            col: 'manufacturerSupplier.id',
            op: 'IN',
            values: [1],
          },
          {
            col: 'castingMode',
            op: 'IN',
            values: ['ESR'],
          },
          {
            col: 'castingDiameter',
            op: 'IN',
            values: ['1x1'],
          },
        ],
        distinct: true,
      };

      service
        .fetchSteelMakingProcessesForSupplierPlantCastingModeCastingDiameter(
          1,
          'ESR',
          '1x1'
        )
        .subscribe((result) => {
          expect(result).toEqual(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/query`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });

  describe('fetchCo2ValuesForSupplierPlantProcess', () => {
    it('should return the co2 values', (done) => {
      const mockResponse = [
        // eslint-disable-next-line unicorn/no-null
        null,
        [1, undefined, undefined, undefined, undefined],
        [3, 1, 1, 1, 'c1'],
      ];
      const mockResult = [
        {
          co2PerTon: 1,
          co2Scope1: undefined,
          co2Scope2: undefined,
          co2Scope3: undefined,
          co2Classification: undefined,
        },
        {
          co2PerTon: 3,
          co2Scope1: 1,
          co2Scope2: 1,
          co2Scope3: 1,
          co2Classification: 'c1',
        },
      ];
      const expectedBody = {
        select: [
          'co2PerTon',
          'co2Scope1',
          'co2Scope2',
          'co2Scope3',
          'co2Classification',
        ],
        where: [
          {
            col: 'manufacturerSupplier.id',
            op: 'IN',
            values: [1],
          },
          {
            col: 'steelMakingProcess',
            op: 'IN',
            values: ['BF+BOF'],
          },
        ],
        distinct: true,
      };

      service
        .fetchCo2ValuesForSupplierPlantProcess(1, 'BF+BOF')
        .subscribe((result) => {
          expect(result).toEqual(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/query`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });
});
