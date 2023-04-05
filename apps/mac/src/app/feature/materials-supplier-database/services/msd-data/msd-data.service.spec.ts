import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/msd/constants';
import {
  AluminumManufacturerSupplier,
  AluminumMaterial,
  AluminumMaterialStandard,
  ManufacturerSupplier,
  ManufacturerSupplierTableValue,
  Material,
  MaterialStandard,
  MaterialStandardTableValue,
  PolymerMaterial,
  SAPMaterialsRequest,
  SAPMaterialsResponse,
  SteelManufacturerSupplier,
  SteelMaterial,
  SteelMaterialStandard,
} from '@mac/msd/models';
import {
  msdServiceAluminumMockResponse,
  msdServiceAluminumMockResult,
  msdServiceCopperMockResponse,
  msdServiceCopperMockResult,
  msdServicePolymerMockResponse,
  msdServicePolymerMockResult,
  msdServiceSteelMockResponse,
  msdServiceSteelMockResult,
} from '@mac/testing/mocks';

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
      const expected = [MaterialClass.STEEL];
      service.getMaterialClasses().subscribe((result: any) => {
        expect(result).toEqual(expected);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/materialClasses`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return only supported material classes', (done) => {
      const mockResponse = ['st', 'unknown', 'al'];
      const expected = [MaterialClass.STEEL, MaterialClass.ALUMINUM];
      service.getMaterialClasses().subscribe((result: any) => {
        expect(result).toEqual(expected);
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
          tooltip: `${translatePrefix}productCategoryValues.strip`,
          tooltipDelay: 1500,
        },
      ];
      service
        .getProductCategories(MaterialClass.STEEL)
        .subscribe((result: any) => {
          expect(result).toEqual(expected);
          expect(translate).toHaveBeenCalledWith(
            `${translatePrefix}productCategoryValues.strip`
          );
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/productCategories`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getMaterials', () => {
    it('should fetch the materials for the given materialClass (steel)', (done) => {
      const mockResponse = msdServiceSteelMockResponse;
      const mockResult = msdServiceSteelMockResult;

      service
        .getMaterials<SteelMaterial>(MaterialClass.STEEL)
        .subscribe((result: any) => {
          expect(result).toEqual(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/st`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch the materials for the given materialClass (alu)', (done) => {
      const mockResponse = msdServiceAluminumMockResponse;
      const mockResult = msdServiceAluminumMockResult;

      service
        .getMaterials<AluminumMaterial>(MaterialClass.ALUMINUM)
        .subscribe((result: any) => {
          // TODO: observe this
          expect(result).toMatchObject(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/al`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch the materials for the given materialClass (polymer)', (done) => {
      const mockResponse = msdServicePolymerMockResponse;
      const mockResult = msdServicePolymerMockResult;

      service
        .getMaterials<PolymerMaterial>(MaterialClass.POLYMER)
        .subscribe((result: any) => {
          // TODO: observe this
          expect(result).toMatchObject(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/px`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch the materials for the given materialClass with category (alu)', (done) => {
      const mockResponse = msdServiceAluminumMockResponse;
      const mockResult = msdServiceAluminumMockResult;

      service
        .getMaterials<AluminumMaterial>(MaterialClass.ALUMINUM, [
          'category',
          undefined,
        ])
        .subscribe((result: any) => {
          // TODO: observe this
          expect(result).toMatchObject(mockResult);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/al?category=category`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch the materials for the given materialClass with category (copper)', (done) => {
      const mockResponse = msdServiceCopperMockResponse;
      const mockResult = msdServiceCopperMockResult;

      service
        .getMaterials<AluminumMaterial>(MaterialClass.COPPER, [
          'category',
          undefined,
        ])
        .subscribe((result: any) => {
          // TODO: observe this
          expect(result).toMatchObject(mockResult);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/cu?category=category`
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
          sapIds: ['123456', '1234567'],
        },
        {
          id: 1,
          name: 'supplier2',
          plant: 'plant2',
          country: 'country2',
        },
      ];
      service
        .fetchManufacturerSuppliers(MaterialClass.STEEL)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/manufacturerSuppliers`
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
          materialNumber: ['1234.1234'],
          standardDocument: 'S 123456',
        },
        {
          id: 1,
          materialName: 'material1',
          materialNumber: ['1234.1234'],
          standardDocument: 'S 123456',
        },
      ];
      service
        .fetchMaterialStandards(MaterialClass.STEEL)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/materialStandards`
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
        `${service['BASE_URL']}/materials/st/ratings`
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
        `${service['BASE_URL']}/materials/st/steelMakingProcesses`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchProductionProcesses', () => {
    it('should return a list of production processes', (done) => {
      const mockResponse: string[] = [
        'hitting it with a hammer',
        'bend it like bender',
      ];
      const mockResult: StringOption[] = [
        {
          id: 'hitting it with a hammer',
          title:
            'materialsSupplierDatabase.productionProcessValues.cu.hitting it with a hammer',
          tooltip:
            'materialsSupplierDatabase.productionProcessValues.cu.hitting it with a hammer',
          tooltipDelay: 1500,
        },
        {
          id: 'bend it like bender',
          title:
            'materialsSupplierDatabase.productionProcessValues.cu.bend it like bender',
          tooltip:
            'materialsSupplierDatabase.productionProcessValues.cu.bend it like bender',
          tooltipDelay: 1500,
        },
      ];
      service
        .fetchProductionProcesses(MaterialClass.COPPER)
        .subscribe((result) => {
          expect(result).toEqual(mockResult);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/cu/productionProcesses`
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
          tooltip:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.invented',
          tooltipDelay: 1500,
        },
        {
          id: 'guessed',
          title:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.guessed',
          tooltip:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.guessed',
          tooltipDelay: 1500,
        },
        {
          id: 'dice roll',
          title:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.dice roll',
          tooltip:
            'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.dice roll',
          tooltipDelay: 1500,
        },
      ];
      service
        .fetchCo2Classifications(MaterialClass.STEEL)
        .subscribe((result) => {
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
      service.fetchCastingModes(MaterialClass.STEEL).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/castingModes`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
  describe('fetchConditions', () => {
    it('should return a list of casting modes', (done) => {
      const mockResponse: string[] = ['abc', 'def'];
      const expected = [
        {
          id: 'abc',
          title: 'materialsSupplierDatabase.condition.st.abc',
          tooltip: 'materialsSupplierDatabase.condition.st.abc',
          tooltipDelay: 1500,
        },
        {
          id: 'def',
          title: 'materialsSupplierDatabase.condition.st.def',
          tooltip: 'materialsSupplierDatabase.condition.st.def',
          tooltipDelay: 1500,
        },
      ];

      service.getConditions(MaterialClass.STEEL).subscribe((result) => {
        expect(result).toEqual(expected);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/conditions`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
  describe('fetchCoatings', () => {
    it('should return a list of casting modes', (done) => {
      const mockResponse: string[] = ['abc', 'def'];
      const expected = [
        {
          id: 'abc',
          title: 'materialsSupplierDatabase.coating.st.abc',
          tooltip: 'materialsSupplierDatabase.coating.st.abc',
          tooltipDelay: 1500,
        },
        {
          id: 'def',
          title: 'materialsSupplierDatabase.coating.st.def',
          tooltip: 'materialsSupplierDatabase.coating.st.def',
          tooltipDelay: 1500,
        },
      ];
      service.getCoatings(MaterialClass.STEEL).subscribe((result) => {
        expect(result).toEqual(expected);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/coatings`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createMaterialStandard', () => {
    it('should post a material standard (steel legacy)', (done) => {
      const mockResponse = { id: 1 };
      service
        .createMaterialStandard({
          materialName: 'name',
          standardDocument: 'S 123456',
          materialNumber: ['1.1234', '1.5678'],
        } as MaterialStandard)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/materialStandards`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        materialName: 'name',
        standardDocument: 'S 123456',
        materialNumber: ['1.1234', '1.5678'],
      });
      req.flush(mockResponse);
    });

    it('should post a material standard (steel)', (done) => {
      const mockResponse = { id: 1 };
      service
        .createMaterialStandard({
          materialName: 'name',
          standardDocument: 'S 123456',
          materialNumber: ['1.1234', '1.5678'],
        } as SteelMaterialStandard)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/materialStandards`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        materialName: 'name',
        standardDocument: 'S 123456',
        materialNumber: ['1.1234', '1.5678'],
      });
      req.flush(mockResponse);
    });

    it('should post a material standard (alu)', (done) => {
      const mockResponse = { id: 1 };
      service
        .createMaterialStandard(
          {} as AluminumMaterialStandard,
          MaterialClass.ALUMINUM
        )
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/al/materialStandards`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('createManufacturerSupplier', () => {
    it('should post a manufacturer supplier (steel legacy)', (done) => {
      const mockResponse = { id: 1 };
      service
        .createManufacturerSupplier({} as ManufacturerSupplier)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/manufacturerSuppliers`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should post a manufacturer supplier (steel)', (done) => {
      const mockResponse = { id: 1 };
      service
        .createManufacturerSupplier({} as SteelManufacturerSupplier)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/manufacturerSuppliers`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should post a manufacturer supplier (alu)', (done) => {
      const mockResponse = { id: 1 };
      service
        .createManufacturerSupplier(
          {} as AluminumManufacturerSupplier,
          MaterialClass.ALUMINUM
        )
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/al/manufacturerSuppliers`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('createMaterial', () => {
    it('should post a material (steel legacy)', (done) => {
      const mockResponse = { id: 1 };
      // eslint-disable-next-line unicorn/no-useless-undefined
      service.createMaterial({} as Material).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/st`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should post a material (steel)', (done) => {
      const mockResponse = { id: 1 };
      service.createMaterial({} as SteelMaterial).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/st`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should post a material (alu)', (done) => {
      const mockResponse = { id: 1 };
      service
        .createMaterial({} as AluminumMaterial, MaterialClass.ALUMINUM)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/al`);
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
      service
        .fetchCastingDiameters(1, 'ingot', MaterialClass.STEEL)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
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
      service
        .fetchReferenceDocuments(1, MaterialClass.STEEL)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
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
        .fetchStandardDocumentsForMaterialName(
          'materialName',
          MaterialClass.STEEL
        )
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
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
        .fetchMaterialNamesForStandardDocuments(
          'standardDocument',
          MaterialClass.STEEL
        )
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
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
        .fetchManufacturerSuppliersForSupplierName(
          'supplier',
          MaterialClass.STEEL
        )
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
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

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
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
        .fetchCo2ValuesForSupplierPlantProcess(1, MaterialClass.STEEL, 'BF+BOF')
        .subscribe((result) => {
          expect(result).toEqual(mockResult);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);
    });
  });

  describe('delete Entity', () => {
    it('should delete a material', (done) => {
      const id = 79;
      service.deleteMaterial(id, MaterialClass.STEEL).subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });

    it('should delete a deleteMaterialStandard', (done) => {
      const id = 79;
      service
        .deleteMaterialStandard(id, MaterialClass.STEEL)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/materialStandards/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });

    it('should delete a deleteManufacturerSupplier', (done) => {
      const id = 79;
      service
        .deleteManufacturerSupplier(id, MaterialClass.STEEL)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/manufacturerSuppliers/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });
  });

  describe('getHistoryForMaterial', () => {
    it('should pull historical data', (done) => {
      const id = 79;
      service
        .getHistoryForMaterial(MaterialClass.STEEL, id)
        .subscribe((result: Material[]) => {
          expect(result).toMatchObject(msdServiceSteelMockResult);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/history/${id}?current=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(msdServiceSteelMockResponse);
    });
  });
  describe('getHistoryForMaterialStandard', () => {
    it('should pull historical data', (done) => {
      const id = 79;
      service
        .getHistoryForMaterialStandard(MaterialClass.STEEL, id)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/history/materialStandards/${id}?current=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush('[]');
    });
  });

  describe('mapSuppliersToTableView', () => {
    it('should return expected', () => {
      const srcArray: ManufacturerSupplier[] = [
        {
          id: 1,
          name: 'one',
          plant: 'pOne',
          country: 'cOne',
          manufacturer: true,
          sapIds: ['1', '2'],
          timestamp: 1345,
          modifiedBy: 'me',
        },
        {
          id: 2,
          name: 'two',
          plant: 'pTwo',
          country: 'cTwo',
          timestamp: 1345,
          modifiedBy: 'me',
        },
      ];
      const expected: ManufacturerSupplierTableValue[] = [
        {
          id: 1,
          manufacturerSupplierName: 'one',
          manufacturerSupplierPlant: 'pOne',
          manufacturerSupplierCountry: 'cOne',
          manufacturer: true,
          sapSupplierIds: ['1', '2'],
          lastModified: 1345,
          modifiedBy: 'me',
        },
        {
          id: 2,
          manufacturerSupplierName: 'two',
          manufacturerSupplierPlant: 'pTwo',
          manufacturerSupplierCountry: 'cTwo',
          lastModified: 1345,
          modifiedBy: 'me',
          manufacturer: undefined,
          sapSupplierIds: undefined,
        },
      ];
      expect(service.mapSuppliersToTableView(srcArray)).toStrictEqual(expected);
    });
  });

  describe('getHistoryForManufacturerSupplier', () => {
    it('should pull historical data', (done) => {
      const id = 79;
      service
        .getHistoryForManufacturerSupplier(MaterialClass.STEEL, id)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/history/manufacturerSuppliers/${id}?current=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush('[]');
    });
  });

  describe('mapStandardsToTableView', () => {
    it('should return expected', () => {
      const srcArray: MaterialStandard[] = [
        {
          id: 1,
          materialName: 'one',
          standardDocument: 'sOne',
          materialNumber: ['1', '2'],
          timestamp: 1345,
          modifiedBy: 'me',
        },
        {
          id: 2,
          materialName: 'two',
          standardDocument: 'sTwo',
          timestamp: 1345,
          modifiedBy: 'me',
        },
      ];
      const expected: MaterialStandardTableValue[] = [
        {
          id: 1,
          materialStandardMaterialName: 'one',
          materialStandardStandardDocument: 'sOne',
          materialNumbers: ['1', '2'],
          lastModified: 1345,
          modifiedBy: 'me',
        },
        {
          id: 2,
          materialStandardMaterialName: 'two',
          materialStandardStandardDocument: 'sTwo',
          lastModified: 1345,
          modifiedBy: 'me',
          materialNumbers: undefined,
        },
      ];
      expect(service.mapStandardsToTableView(srcArray)).toStrictEqual(expected);
    });
  });

  describe('fetchSAPMaterials', () => {
    it('should fetch sap materials', (done) => {
      const mockRequest: SAPMaterialsRequest = {} as SAPMaterialsRequest;
      const mockResponse: SAPMaterialsResponse = {
        data: [],
        lastRow: -1,
        totalRows: 300,
        subTotalRows: 100,
      };

      service.fetchSAPMaterials(mockRequest).subscribe((result: any) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/query`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
});
