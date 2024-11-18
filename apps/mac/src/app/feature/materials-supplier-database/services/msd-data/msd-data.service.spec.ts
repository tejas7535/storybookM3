import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import moment from 'moment';

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
  MaterialRequest,
  MaterialStandard,
  MaterialStandardTableValue,
  PolymerMaterial,
  ProductCategoryRule,
  ProductCategoryRuleTableValue,
  SAPMaterial,
  SAPMaterialHistoryValue,
  SapMaterialsDatabaseUploadStatus,
  SapMaterialsDatabaseUploadStatusResponse,
  SAPMaterialsRequest,
  SAPMaterialsResponse,
  SapMaterialsUpload,
  SapMaterialsUploadResponse,
  SteelManufacturerSupplier,
  SteelMaterial,
  SteelMaterialStandard,
} from '@mac/msd/models';
import {
  msdServiceAluminumMockResponse,
  msdServiceAluminumMockResult,
  msdServiceCeramicMockResponse,
  msdServiceCeramicMockResult,
  msdServiceCopperMockResponse,
  msdServiceCopperMockResult,
  msdServiceLubricantMockResponse,
  msdServiceLubricantMockResult,
  msdServicePolymerMockResponse,
  msdServicePolymerMockResult,
  msdServiceSteelMockResponse,
  msdServiceSteelMockResult,
} from '@mac/testing/mocks';

import * as en from '../../../../../assets/i18n/en.json';
import { MsdDataService } from './msd-data.service';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MsdDataService', () => {
  let spectator: SpectatorService<MsdDataService>;
  let service: MsdDataService;
  let httpMock: HttpTestingController;
  let localStorage: Storage;

  const translatePrefix = 'materialsSupplierDatabase.';

  const createService = createServiceFactory({
    service: MsdDataService,
    imports: [HttpClientTestingModule, provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: LOCAL_STORAGE,
        useValue: {
          setItem: jest.fn(),
          removeItem: jest.fn(),
          getItem: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
    localStorage = spectator.inject(LOCAL_STORAGE);
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
          expect(result).toMatchObject(mockResult);
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

    it('should fetch the materials for the given materialClass with category (copper)', (done) => {
      const mockResponse = msdServiceCopperMockResponse;
      const mockResult = msdServiceCopperMockResult;

      service
        .getMaterials<AluminumMaterial>(MaterialClass.COPPER)
        .subscribe((result: any) => {
          // TODO: observe this
          expect(result).toMatchObject(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/cu`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch the materials for the given materialClass with category (ceramic)', (done) => {
      const mockResponse = msdServiceCeramicMockResponse;
      const mockResult = msdServiceCeramicMockResult;

      service
        .getMaterials<AluminumMaterial>(MaterialClass.CERAMIC)
        .subscribe((result: any) => {
          // TODO: observe this
          expect(result).toMatchObject(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/ce`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch the materials for the given materialClass with category (lubricant)', (done) => {
      const mockResponse = msdServiceLubricantMockResponse;
      const mockResult = msdServiceLubricantMockResult;

      service
        .getMaterials<AluminumMaterial>(MaterialClass.LUBRICANTS)
        .subscribe((result: any) => {
          // TODO: observe this
          expect(result).toMatchObject(mockResult);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/materials/lu`);
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
          businessPartnerIds: [1, 2],
          sapSupplierIds: ['123456', '1234567'],
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

  describe('fetchProductCategoryRules', () => {
    it('should return a list of productCategoryRules', (done) => {
      const mockResponse: ProductCategoryRule[] = [
        {
          id: 1,
          timestamp: 0,
          title: 'test',
          allocationToSideProducts: false,
          materialClass: MaterialClass.STEEL,
          modifiedBy: 'dev',
          uploadFile: {
            azureReference: 'ref',
            filename: 'test',
            id: 1,
            type: 'pcr',
          },
          validUntil: 0,
          version: '1',
        },
        {
          id: 2,
          timestamp: 0,
          title: 'test2',
          allocationToSideProducts: false,
          materialClass: MaterialClass.STEEL,
          modifiedBy: 'dev',
          uploadFile: {
            azureReference: 'ref',
            filename: 'test2',
            id: 2,
            type: 'pcr',
          },
          validUntil: 0,
          version: '1',
        },
      ];
      service
        .fetchProductCategoryRules(MaterialClass.STEEL)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/productCategoryRules`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('fetchCo2Standards', () => {
    it('should return a list of co2 standards', (done) => {
      const mockResponse: string[] = ['standard1', 'standard2'];
      service.fetchCo2Standards(MaterialClass.STEEL).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/query`
      );
      expect(req.request.method).toBe('POST');
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

  describe('formCreateMaterial', () => {
    it('should post a form material with file (steel)', (done) => {
      const mockInput = {
        id: 1,
        co2UploadFile: new File([], 'test.pdf'),
      };
      const { co2UploadFile, ...mockMaterialWithoutFile } = mockInput;

      const formData = new FormData();
      formData.append(
        'material',
        new Blob([JSON.stringify(mockMaterialWithoutFile)], {
          type: 'application/json',
        })
      );
      formData.append('file', co2UploadFile);

      const mockResponse = { id: 1 };
      service.formCreateMaterial(mockInput as Material).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/form`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);
      req.flush(mockResponse);
    });

    it('should post a form material with id (steel)', (done) => {
      const mockInput = {
        id: 1,
        co2UploadFileId: 1,
      };

      const formData = new FormData();
      formData.append(
        'material',
        new Blob([JSON.stringify(mockInput)], {
          type: 'application/json',
        })
      );
      // eslint-disable-next-line unicorn/no-useless-undefined
      formData.append('file', undefined);

      const mockResponse = { id: 1 };
      service.formCreateMaterial(mockInput as Material).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/form`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);
      req.flush(mockResponse);
    });
  });

  it('should post a bulk material edit (steel)', (done) => {
    const mockResponse = '';
    service.bulkEditMaterial([{} as MaterialRequest]).subscribe((result) => {
      expect(result).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(`${service['BASE_URL']}/materials/st/bulk`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should post a bulk material edit (alu)', (done) => {
    const mockResponse = '';
    service
      .bulkEditMaterial([{} as MaterialRequest], MaterialClass.ALUMINUM)
      .subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

    const req = httpMock.expectOne(`${service['BASE_URL']}/materials/al/bulk`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
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
        distinct: true,
      };
      service
        .fetchReferenceDocuments(MaterialClass.STEEL)
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
          {
            col: 'productCategory',
            op: 'IN',
            values: ['brightBar'],
          },
        ],
        distinct: true,
      };

      service
        .fetchCo2ValuesForSupplierPlantProcess(
          1,
          MaterialClass.STEEL,
          'BF+BOF',
          'brightBar'
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

    it('should return the co2 values without steelmaking, category', (done) => {
      const mockResponse = [[6, 1, 2, 3, 'c1']];
      const mockResult = [
        {
          co2PerTon: 6,
          co2Scope1: 1,
          co2Scope2: 2,
          co2Scope3: 3,
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
        ],
        distinct: true,
      };

      service
        .fetchCo2ValuesForSupplierPlantProcess(1, MaterialClass.STEEL)
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
    it('should delete a material (ST)', (done) => {
      const id = 79;
      service.deleteMaterial(id).subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });
    it('should delete a material (AL)', (done) => {
      const id = 79;
      service
        .deleteMaterial(id, MaterialClass.ALUMINUM)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/al/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });

    it('should delete a deleteMaterialStandard (steel)', (done) => {
      const id = 79;
      service.deleteMaterialStandard(id).subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/materialStandards/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });

    it('should delete a deleteMaterialStandard (al)', (done) => {
      const id = 79;
      service
        .deleteMaterialStandard(id, MaterialClass.ALUMINUM)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/al/materialStandards/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });

    it('should delete a deleteManufacturerSupplier (steel)', (done) => {
      const id = 79;
      service.deleteManufacturerSupplier(id).subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/manufacturerSuppliers/${id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });

    it('should delete a deleteManufacturerSupplier (AL)', (done) => {
      const id = 79;
      service
        .deleteManufacturerSupplier(id, MaterialClass.ALUMINUM)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/al/manufacturerSuppliers/${id}`
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

  describe('getHistoryForProductCategoryRule', () => {
    it('should pull historical data', (done) => {
      const id = 79;
      service
        .getHistoryForProductCategoryRule(MaterialClass.STEEL, id)
        .subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL']}/materials/st/history/productCategoryRules/${id}?current=true`
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
          country: 'IT',
          manufacturer: true,
          businessPartnerIds: [1, 2],
          sapSupplierIds: ['1', '2'],
          timestamp: 1345,
          modifiedBy: 'me',
        },
        {
          id: 2,
          name: 'two',
          plant: 'pTwo',
          country: 'DE',
          timestamp: 1345,
          modifiedBy: 'me',
        },
      ];
      const expected: ManufacturerSupplierTableValue[] = [
        {
          id: 1,
          manufacturerSupplierName: 'one',
          manufacturerSupplierPlant: 'pOne',
          manufacturerSupplierCountry: 'IT',
          manufacturerSupplierRegion: 'EU',
          manufacturer: true,
          manufacturerSupplierSapSupplierIds: ['1', '2'],
          manufacturerSupplierBusinessPartnerIds: [1, 2],
          lastModified: 1345,
          modifiedBy: 'me',
        },
        {
          id: 2,
          manufacturerSupplierName: 'two',
          manufacturerSupplierPlant: 'pTwo',
          manufacturerSupplierCountry: 'DE',
          manufacturerSupplierRegion: 'EU',
          lastModified: 1345,
          modifiedBy: 'me',
          manufacturer: undefined,
          manufacturerSupplierSapSupplierIds: undefined,
          manufacturerSupplierBusinessPartnerIds: undefined,
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
          wiamId: 'WiamId',
          stoffId: 'StoffId',
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
          materialStandardWiamId: 'WiamId',
          materialStandardStoffId: 'StoffId',
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
          materialStandardWiamId: undefined,
          materialStandardStoffId: undefined,
        },
      ];
      expect(service.mapStandardsToTableView(srcArray)).toStrictEqual(expected);
    });
  });
  describe('mapProductCategoryRulesToTableView', () => {
    it('should return expected', () => {
      const srcArray: ProductCategoryRule[] = [
        {
          id: 1,
          timestamp: 0,
          title: 'test',
          allocationToSideProducts: false,
          materialClass: MaterialClass.STEEL,
          modifiedBy: 'dev',
          uploadFile: {
            azureReference: 'ref',
            filename: 'test',
            id: 1,
            type: 'pcr',
          },
          validUntil: 0,
          version: '1',
        },
        {
          id: 2,
          timestamp: 0,
          title: 'test2',
          allocationToSideProducts: false,
          materialClass: MaterialClass.STEEL,
          modifiedBy: 'dev',
          uploadFile: {
            azureReference: 'ref',
            filename: 'test2',
            id: 2,
            type: 'pcr',
          },
          validUntil: 0,
          version: '1',
        },
      ];
      const expected: ProductCategoryRuleTableValue[] = [
        {
          id: 1,
          lastModified: 0,
          title: 'test',
          allocationToSideProducts: false,
          materialClass: MaterialClass.STEEL,
          modifiedBy: 'dev',
          filename: 'test',
          uploadFileId: 1,
          validUntil: 0,
          version: '1',
        },
        {
          id: 2,
          lastModified: 0,
          title: 'test2',
          allocationToSideProducts: false,
          materialClass: MaterialClass.STEEL,
          modifiedBy: 'dev',
          filename: 'test2',
          uploadFileId: 2,
          validUntil: 0,
          version: '1',
        },
      ];
      expect(
        service.mapProductCategoryRulesToTableView(srcArray)
      ).toStrictEqual(expected);
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

  describe('uploadSapMaterials', () => {
    it('should upload sap materials', (done) => {
      const dateString = '1995-12-25';

      const upload: SapMaterialsUpload = {
        owner: 'Tester',
        maturity: 10,
        date: moment(dateString),
        file: new File([''], 'test.xlsx'),
      };

      const response = {
        type: HttpEventType.Response,
        body: {
          uploadId: 'testUploadId',
        },
      } as HttpResponse<SapMaterialsUploadResponse>;

      service
        .uploadSapMaterials(upload)
        .subscribe((result: HttpEvent<SapMaterialsUploadResponse>) => {
          expect(result).toEqual(response);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/upload/file`
      );
      const formData = req.request.body as FormData;

      expect(req.request.method).toBe('POST');
      expect(formData.get('owner')).toBe(upload.owner);
      expect(formData.get('date')).toBe(dateString);
      expect(formData.get('maturity')).toBe(upload.maturity.toString());
      expect(formData.get('file')).toBe(upload.file);

      req.event(response);
    });
  });

  describe('getSAPMaterialHistory', () => {
    it('should get SAP material history', (done) => {
      const materialNumber = '050919660-0000';
      const supplierId = 'S000283632';
      const plant = '0045';

      const response = [
        {
          materialNumber,
          materialDescription: 'F-234690-1912.SRG',
          materialGroup: 'M36042',
          category: 'M413',
          businessPartnerId: '1069871',
          supplierId,
          plant,
          supplierCountry: 'SK',
          supplierRegion: 'EU',
          emissionFactorKg: 2.32,
          emissionFactorPc: 3.99,
          dataDate: 1_562_191_200_000,
          dataComment:
            'Value for physical emission factor of same (category, material group, supplier country)',
          recycledMaterialShare: 0.25,
          secondaryMaterialShare: 0.04,
          rawMaterialManufacturer: 'test manufacturer',
          incoterms: 'FCA',
          supplierLocation: 'Berlin',
          fossilEnergyShare: 0.25,
          nuclearEnergyShare: 0.4,
          renewableEnergyShare: 0.25,
          onlyRenewableElectricity: true,
          validFrom: 1_672_527_600_000,
          validUntil: 1_862_175_600_000,
          primaryDataShare: 0.77,
          dqrPrimary: 8.1,
          dqrSecondary: 1.1,
          secondaryDataSources: 'secondary4',
          crossSectoralStandardsUsed: 'Std3',
          customerCalculationMethodApplied: false,
          linkToCustomerCalculationMethod: 'http://test.de',
          calculationMethodVerifiedBy3rdParty: true,
          linkTo3rdPartyVerificationProof: 'https://www.google.de',
          pcfVerifiedBy3rdParty: false,
          pcfLogistics: 99,
          serviceInputGrossWeight: 13,
          netWeight: 23,
          weightDataSource: 'Master data',
          materialUtilizationFactor: 0.369,
          materialGroupOfRawMaterial: 'M032',
          rawMaterialEmissionFactor: 3.2,
          processSurcharge: 1.1,
          rawMaterial: 'RM',
          directSupplierEmissions: 1,
          indirectSupplierEmissions: 1,
          upstreamEmissions: 0.32,
          stoffId: 'testStoffId',
          owner: 'Test owner',
          maturity: 1,
          modifiedBy: 'Tester',
          timestamp: 1_696_000_509.596_856,
          historic: false,
          uploadId: 'd289909b-2a30-4d3c-ba5a-79ae4cadd843',
        },
      ];

      const expected = [
        {
          materialNumber: response[0].materialNumber,
          materialDescription: response[0].materialDescription,
          materialGroup: response[0].materialGroup,
          category: response[0].category,
          businessPartnerId: response[0].businessPartnerId,
          supplierId: response[0].supplierId,
          plant: response[0].plant,
          supplierCountry: response[0].supplierCountry,
          supplierRegion: response[0].supplierRegion,
          emissionFactorKg: response[0].emissionFactorKg,
          emissionFactorPc: response[0].emissionFactorPc,
          dataDate: new Date(response[0].dataDate).toLocaleDateString('en-GB'),
          dataComment: response[0].dataComment,
          recycledMaterialShare: response[0].recycledMaterialShare,
          secondaryMaterialShare: response[0].secondaryMaterialShare,
          rawMaterialManufacturer: response[0].rawMaterialManufacturer,
          incoterms: response[0].incoterms,
          supplierLocation: response[0].supplierLocation,
          fossilEnergyShare: response[0].fossilEnergyShare,
          nuclearEnergyShare: response[0].nuclearEnergyShare,
          renewableEnergyShare: response[0].renewableEnergyShare,
          onlyRenewableElectricity: 'materialsSupplierDatabase.mainTable.yes',
          validFrom: new Date(response[0].validFrom).toLocaleDateString(
            'en-GB'
          ),
          validUntil: new Date(response[0].validUntil).toLocaleDateString(
            'en-GB'
          ),
          primaryDataShare: response[0].primaryDataShare,
          dqrPrimary: response[0].dqrPrimary,
          dqrSecondary: response[0].dqrSecondary,
          secondaryDataSources: response[0].secondaryDataSources,
          crossSectoralStandardsUsed: response[0].crossSectoralStandardsUsed,
          customerCalculationMethodApplied:
            'materialsSupplierDatabase.mainTable.no',
          linkToCustomerCalculationMethod:
            response[0].linkToCustomerCalculationMethod,
          calculationMethodVerifiedBy3rdParty:
            'materialsSupplierDatabase.mainTable.yes',
          linkTo3rdPartyVerificationProof:
            response[0].linkTo3rdPartyVerificationProof,
          pcfVerifiedBy3rdParty: 'materialsSupplierDatabase.mainTable.no',
          pcfLogistics: response[0].pcfLogistics,
          serviceInputGrossWeight: response[0].serviceInputGrossWeight,
          netWeight: response[0].netWeight,
          weightDataSource: response[0].weightDataSource,
          materialUtilizationFactor: response[0].materialUtilizationFactor,
          materialGroupOfRawMaterial: response[0].materialGroupOfRawMaterial,
          rawMaterialEmissionFactor: response[0].rawMaterialEmissionFactor,
          processSurcharge: response[0].processSurcharge,
          rawMaterial: response[0].rawMaterial,
          directSupplierEmissions: response[0].directSupplierEmissions,
          indirectSupplierEmissions: response[0].indirectSupplierEmissions,
          upstreamEmissions: response[0].upstreamEmissions,
          stoffId: response[0].stoffId,
          owner: response[0].owner,
          maturity: response[0].maturity,
          modifiedBy: response[0].modifiedBy,
          lastModified: response[0].timestamp,
        },
      ];

      service
        .getHistoryForSAPMaterial(materialNumber, supplierId, plant)
        .subscribe((result: SAPMaterialHistoryValue[]) => {
          expect(result).toEqual(expected);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/history/${materialNumber}/${supplierId}/${plant}`
      );

      expect(req.request.method).toBe('GET');

      req.flush(response);
    });
  });

  describe('getDistinctSapValues', () => {
    it('should get distinct SAP values', (done) => {
      const response = { values: ['1', '2', '3'] };
      const expected = ['1', '2', '3'];

      service.getDistinctSapValues('test').subscribe((result: string[]) => {
        expect(result).toEqual(expected);
        done();
      });

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/distinct/test`
      );
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });

  describe('getDistinctSapValuesWithText', () => {
    it('should get distinct SAP values with text', (done) => {
      const response = {
        values: [
          {
            value: '1',
            text: 'text1',
          },
          {
            value: '2',
            text: 'text2',
          },
          {
            value: '3',
            text: 'text3',
          },
        ],
      };
      const expected = [
        {
          value: '1',
          text: 'text1',
        },
        {
          value: '2',
          text: 'text2',
        },
        {
          value: '3',
          text: 'text3',
        },
      ];

      service
        .getDistinctSapValuesWithText('test', 'test')
        .subscribe((result) => {
          expect(result).toEqual(expected);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/distinct/test?textColumn=test`
      );
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });

  describe('getSapMaterialsDatabaseUploadStatus', () => {
    it('should get SAP materials database upload status', (done) => {
      const uploadId = '3d75599c-90ee-4d26-b2fa-8b41d9c8786d';
      const response: SapMaterialsDatabaseUploadStatusResponse = {
        timestamp: new Date(),
        status: SapMaterialsDatabaseUploadStatus.DONE,
        rejectedCount: 10,
        uploadedCount: 50,
      };

      service
        .getSapMaterialsDatabaseUploadStatus(uploadId)
        .subscribe((result: SapMaterialsDatabaseUploadStatusResponse) => {
          expect(result).toEqual(response);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/upload/status/${uploadId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });

  describe('getRejectedSapMaterials', () => {
    it('should get rejected SAP materials', (done) => {
      const uploadId = '3d75599c-90ee-4d26-b2fa-8b41d9c8786d';
      const response = [
        {
          materialNumber: '111122222-1111',
          materialDescription: 'F-234690-1912.SRG',
          materialGroup: 'M36042',
          category: 'M413',
          businessPartnerId: '1069871',
          supplierId: 'S000000001',
          plant: '0046',
          supplierCountry: 'SK',
          supplierRegion: 'EU',
          emissionFactorKg: 2.32,
          emissionFactorPc: 3.99,
          dataDate: 1_562_191_200_000,
          dataComment:
            'Value for physical emission factor of same (category, material group, supplier country)',
          recycledMaterialShare: 0.25,
          secondaryMaterialShare: 0.04,
          rawMaterialManufacturer: 'test manufacturer',
          incoterms: 'FCA',
          supplierLocation: 'Berlin',
          fossilEnergyShare: 0.25,
          nuclearEnergyShare: 0.4,
          renewableEnergyShare: 0.25,
          onlyRenewableElectricity: true,
          validFrom: 1_672_527_600_000,
          validUntil: 1_862_175_600_000,
          primaryDataShare: 0.77,
          dqrPrimary: 8.1,
          dqrSecondary: 1.1,
          secondaryDataSources: 'secondary4',
          crossSectoralStandardsUsed: 'Std3',
          customerCalculationMethodApplied: false,
          linkToCustomerCalculationMethod: 'http://test.de',
          calculationMethodVerifiedBy3rdParty: true,
          linkTo3rdPartyVerificationProof: 'https://www.google.de',
          pcfVerifiedBy3rdParty: false,
          pcfLogistics: 99,
          serviceInputGrossWeight: 13,
          netWeight: 23,
          weightDataSource: 'Master data',
          materialUtilizationFactor: 0.369,
          materialGroupOfRawMaterial: 'M032',
          rawMaterialEmissionFactor: 3.2,
          processSurcharge: 1.1,
          rawMaterial: 'RM',
          directSupplierEmissions: 1,
          indirectSupplierEmissions: 1,
          upstreamEmissions: 0.32,
          stoffId: 'testStoffId',
          owner: 'Test owner',
          maturity: 1,
          modifiedBy: 'Tester',
          timestamp: 1_696_000_509.596_856,
          historic: false,
          uploadId,
        },
      ];

      service
        .getRejectedSapMaterials(uploadId)
        .subscribe((result: SAPMaterial[]) => {
          expect(result).toEqual(response);
          done();
        });

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/upload/rejected/${uploadId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });

  describe('deleteRejectedSapMaterials', () => {
    test('should delete rejected SAP materials', (done) => {
      const uploadId = '3d75599c-90ee-4d26-b2fa-8b41d9c8786d';

      service.deleteRejectedSapMaterials(uploadId).subscribe(() => done());

      const req = httpMock.expectOne(
        `${service['BASE_URL_SAP']}/emissionfactor/upload/rejected/${uploadId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });
  });

  describe('SAP materials upload ID localStorage', () => {
    it('should store', () => {
      const uploadId = 'test';

      service.storeSapMaterialsUploadId(uploadId);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        service['SAP_MATERIALS_UPLOAD_ID_LOCAL_STORAGE_KEY'],
        uploadId
      );
    });

    it('should remove', () => {
      service.removeSapMaterialsUploadId();

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        service['SAP_MATERIALS_UPLOAD_ID_LOCAL_STORAGE_KEY']
      );
    });

    it('should get', () => {
      service.getSapMaterialsUploadId();

      expect(localStorage.getItem).toHaveBeenCalledWith(
        service['SAP_MATERIALS_UPLOAD_ID_LOCAL_STORAGE_KEY']
      );
    });
  });

  describe('fromJson', () => {
    it('should return undefined on empty array', () => {
      expect(service['fromJson']([])).toBeFalsy();
    });
    it('should return undefined on undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(service['fromJson'](undefined)).toBeFalsy();
    });
    it('should return array on array with data', () => {
      expect(service['fromJson'](['1'])).toStrictEqual(['1']);
    });
  });
});
