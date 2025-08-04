import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom, of } from 'rxjs';

import { environment } from '@ea/environments/environment';
import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  CalculationParametersOperationConditions,
  CalculationResultReportInput,
  CatalogCalculationResult,
  LoadCaseData,
  ProductCapabilitiesResult,
} from '../store/models';
import { BearinxOnlineResult } from './bearinx-result.interface';
import { CatalogVersionInfoResponse } from './bearinx-version.interface';
import { CatalogService } from './catalog.service';
import {
  CatalogServiceBasicFrequenciesResult,
  CatalogServiceCalculationResult,
  CatalogServiceLoadCaseData,
  CatalogServiceTemplateResult,
} from './catalog.service.interface';
import { CatalogCalculationInputsConverterService } from './catalog-calculation-inputs-converter.service';
import { convertCatalogCalculationResult } from './catalog-helper';

jest.mock('./catalog-helper', () => ({
  ...jest.requireActual('./catalog-helper'),
  convertCatalogCalculationResult: jest.fn(
    () => ({}) as CatalogCalculationResult
  ),
}));

describe('CatalogService', () => {
  let catalogService: CatalogService;
  let spectator: SpectatorService<CatalogService>;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.catalogApiBaseUrl}/v1/CatalogBearing`;

  const createService = createServiceFactory({
    service: CatalogService,
    providers: [
      CatalogService,
      {
        provide: CatalogCalculationInputsConverterService,
        useValue: {
          convertCatalogInputsResponse: jest.fn(
            (): CalculationResultReportInput[] => []
          ),
        },
      },
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    catalogService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(catalogService).toBeDefined();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getBearingSearch', () => {
    it('should return an observable of bearingDesignations', () => {
      const url = `${baseUrl}/product/search?pattern=bearing&size=15000`;

      const mockData = {
        data: [
          {
            data: {
              title: 'Bearing 1',
            },
          },
          {
            data: {
              title: 'Bearing 2',
            },
          },
          {
            data: {
              title: '694-2Z-HLC-C3',
            },
          },
        ],
      };
      const query = 'bearing';
      catalogService
        .getBearingSearch(query)
        .subscribe((bearingDesignations) => {
          expect(bearingDesignations).toEqual(['Bearing 1', 'Bearing 2']);
        });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getBearingCapabilities', () => {
    it('should call the service to fetch the product capabilities', () => {
      const url = `${baseUrl}/product/capabilities?designation=6226`;

      const mockResponse: ProductCapabilitiesResult = {
        productInfo: {
          id: 'test',
          designation: '6226',
          bearinxClass: CATALOG_BEARING_TYPE,
        },
        capabilityInfo: {
          frictionCalculation: true,
        },
      };

      catalogService.getBearingCapabilities('6226').subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });

  describe('getBasicFrequencies', () => {
    it('should call the service to get the basic frequencies', waitForAsync(() => {
      const rawResult: CatalogServiceBasicFrequenciesResult = {
        data: {
          message: '',
          status: '',
          results: [
            {
              fields: [
                {
                  abbreviation: 'abc',
                  id: '2',
                  title: 'field-title',
                  values: [{ index: 3, content: '1233.123', unit: 'cm' }],
                },
              ],
              id: '1',
              title: 'my-title',
            },
          ],
        },
      };
      const url = `${baseUrl}/product/basicfrequencies/my-id`;

      firstValueFrom(catalogService.getBasicFrequencies('my-id')).then(
        (res) => {
          expect(res).toMatchSnapshot();
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(rawResult);
    }));

    it('should throw if no bearing id is provided', () =>
      expect(
        firstValueFrom(catalogService.getBasicFrequencies(undefined))
      ).rejects.toThrow());
  });

  describe('getBasicFrequenciesPdf', () => {
    beforeEach(() => {
      global.URL.createObjectURL = jest.fn();
      global.document.createElement = jest.fn();
    });

    afterEach(() => {
      (global.document.createElement as jest.Mock).mockReset();
      (global.URL.createObjectURL as jest.Mock).mockReset();
    });

    it('should call the service to get basic frequencies as PDF', waitForAsync(() => {
      const url = `${baseUrl}/product/basicfrequencies/pdf/my-id`;
      const mockResult = new Blob();

      firstValueFrom(catalogService.getBasicFrequenciesPdf('my-id')).then(
        (res) => {
          expect(res).toEqual(mockResult);
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));
  });

  describe('downloadBasicFrequenciesPdf', () => {
    let mockElement: any;

    beforeEach(() => {
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      mockElement = {
        target: '',
        href: '',
        click: jest.fn(),
      };
      global.document.createElement = jest.fn(
        () => mockElement as HTMLAnchorElement
      );
    });

    afterEach(() => {
      (global.document.createElement as jest.Mock).mockReset();
      (global.URL.createObjectURL as jest.Mock).mockReset();
    });

    it('should download basic frequencies PDF', waitForAsync(() => {
      const url = `${baseUrl}/product/basicfrequencies/pdf/my-id`;
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });

      firstValueFrom(catalogService.downloadBasicFrequenciesPdf('my-id')).then(
        () => {
          expect(global.URL.createObjectURL).toHaveBeenCalledWith(
            expect.any(Blob)
          );
          expect(mockElement.click).toHaveBeenCalled();
          expect(mockElement.target).toBe('_blank');
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlob);
    }));
  });

  describe('getCalculationResultReport', () => {
    it('should get calculation result report', waitForAsync(() => {
      const mockResult: CatalogServiceCalculationResult = {
        _links: [{ rel: 'json', href: 'https://example.com/report.json' }],
        state: true,
        data: {
          message: '',
          status: '',
          results: undefined,
          errors: [],
          warnings: [],
          messages: [],
        },
      };

      const mockReportResult = {} as BearinxOnlineResult;

      firstValueFrom(
        catalogService.getCalculationResultReport(mockResult)
      ).then((res) => {
        expect(res).toEqual(mockReportResult);
      });

      const req = httpMock.expectOne('https://example.com/report.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockReportResult);
    }));

    it('should throw error when no report url found', () => {
      const mockResult: CatalogServiceCalculationResult = {
        _links: [],
        state: true,
        data: {
          message: '',
          status: '',
          results: undefined,
          errors: [],
          warnings: [],
          messages: [],
        },
      };

      expect(() =>
        catalogService.getCalculationResultReport(mockResult)
      ).toThrow('Unable to find report url');
    });
  });

  describe('getLoadcaseTemplate', () => {
    it('should get loadcase template', waitForAsync(() => {
      const mockTemplate: CatalogServiceTemplateResult = {
        status: '',
        message: '',
        input: [
          {
            _id: '1',
            id: '1',
            categoryId: 'cat1',
            title: 'template',
            fields: [],
          },
        ],
        _links: [],
      };

      catalogService.getLoadcaseTemplate('bearing-id').subscribe((result) => {
        expect(result).toBeDefined();
      });

      const req = httpMock.expectOne(
        `${baseUrl}/product/loadcasetemplate/bearing-id`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTemplate);
    }));
  });

  describe('getOperatingConditionsTemplate', () => {
    it('should get operating conditions template', waitForAsync(() => {
      const mockTemplate: CatalogServiceTemplateResult = {
        status: '',
        message: '',
        input: [
          {
            _id: '1',
            id: '1',
            categoryId: 'cat1',
            title: 'template',
            fields: [],
          },
        ],
        _links: [],
      };

      catalogService
        .getOperatingConditionsTemplate('bearing-id')
        .subscribe((result) => {
          expect(result).toBeDefined();
        });

      const req = httpMock.expectOne(
        `${baseUrl}/product/operatingconditonstemplate/bearing-id`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTemplate);
    }));
  });

  describe('isSlewingBearing', () => {
    it('should return true for slewing bearing class', () => {
      const result = catalogService['isSlewingBearing'](SLEWING_BEARING_TYPE);
      expect(result).toBe(true);
    });

    it('should return false for catalog bearing class', () => {
      const result = catalogService['isSlewingBearing'](CATALOG_BEARING_TYPE);
      expect(result).toBe(false);
    });

    it('should return false for undefined bearing class', () => {
      const result = catalogService['isSlewingBearing'](undefined);
      expect(result).toBe(false);
    });
  });

  describe('isLubricationOfrecirculatingOil', () => {
    it('should return true for recirculating oil lubrication', () => {
      const result = catalogService['isLubricationOfrecirculatingOil'](
        'LB_RECIRCULATING_OIL_LUBRICATION'
      );
      expect(result).toBe(true);
    });

    it('should return false for grease lubrication', () => {
      const result = catalogService['isLubricationOfrecirculatingOil'](
        'LB_GREASE_LUBRICATION'
      );
      expect(result).toBe(false);
    });
  });

  describe('getCatalogBearingLoadCasesData', () => {
    it('should convert load case data for single load case', () => {
      const loadCaseData: LoadCaseData[] = [
        {
          loadCaseName: 'Test Load Case',
          operatingTime: 50,
          load: {
            axialLoad: 100,
            radialLoad: 200,
          },
          operatingTemperature: 80,
          rotation: {
            typeOfMotion: 'LB_ROTATING',
            rotationalSpeed: 1500,
            shiftFrequency: 10,
            shiftAngle: 90,
          },
          force: { fx: 0, fy: 0 },
          moment: { mx: 0, my: 0 },
        },
      ];

      const result =
        catalogService['getCatalogBearingLoadCasesData'](loadCaseData);

      expect(result).toEqual([
        {
          IDCO_DESIGNATION: '',
          IDSLC_TIME_PORTION: '100',
          IDSLC_AXIAL_LOAD: '100',
          IDSLC_RADIAL_LOAD: '200',
          IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE: '80',
          IDSLC_TYPE_OF_MOVEMENT: 'LB_ROTATING',
          IDLC_SPEED: '1500',
          IDSLC_MOVEMENT_FREQUENCY: '10',
          IDSLC_OPERATING_ANGLE: '90',
        },
      ]);
    });

    it('should convert load case data for multiple load cases', () => {
      const loadCaseData: LoadCaseData[] = [
        {
          loadCaseName: 'Load Case 1',
          operatingTime: 60,
          load: { axialLoad: 100, radialLoad: 200 },
          operatingTemperature: 80,
          rotation: {
            typeOfMotion: 'LB_ROTATING',
            rotationalSpeed: 1500,
            shiftFrequency: 10,
            shiftAngle: 90,
          },
          force: { fx: 0, fy: 0 },
          moment: { mx: 0, my: 0 },
        },
        {
          loadCaseName: 'Load Case 2',
          operatingTime: 40,
          load: { axialLoad: 150, radialLoad: 250 },
          operatingTemperature: 90,
          rotation: {
            typeOfMotion: 'LB_OSCILLATING',
            rotationalSpeed: 1000,
            shiftFrequency: 5,
            shiftAngle: 45,
          },
          force: { fx: 0, fy: 0 },
          moment: { mx: 0, my: 0 },
        },
      ];

      const result =
        catalogService['getCatalogBearingLoadCasesData'](loadCaseData);

      expect(result[0].IDCO_DESIGNATION).toBe('Load Case 1');
      expect(result[0].IDSLC_TIME_PORTION).toBe('60');
      expect(result[1].IDCO_DESIGNATION).toBe('Load Case 2');
      expect(result[1].IDSLC_TIME_PORTION).toBe('40');
    });
  });

  describe('getSlewingBearingLoadcaseData', () => {
    it('should convert slewing bearing load case data', () => {
      const loadCaseData: LoadCaseData[] = [
        {
          loadCaseName: 'Slewing Test',
          operatingTime: 75,
          load: { axialLoad: 0, radialLoad: 0 },
          operatingTemperature: 0,
          force: {
            fx: 500,
            fy: 600,
          },
          moment: {
            mx: 1000,
            my: 1200,
          },
          rotation: {
            typeOfMotion: 'LB_ROTATING',
            shiftFrequency: 15,
            shiftAngle: 180,
            rotationalSpeed: 500,
          },
        },
      ];

      const result =
        catalogService['getSlewingBearingLoadcaseData'](loadCaseData);

      expect(result).toEqual([
        {
          IDCO_DESIGNATION: 'Slewing Test',
          IDSLC_TIME_PORTION: '100',
          IDLD_FX: '500',
          IDLD_FY: '600',
          IDLD_MX: '1000',
          IDLD_MY: '1200',
          IDSLC_N_OSC_LIMITED: '15',
          IDSLC_OPERATING_ANGLE: '180',
          IDSLC_N_LIMITED: '500',
          IDSLC_TYPE_OF_MOVEMENT: 'LB_ROTATING',
        },
      ]);
    });

    it('should handle undefined values with defaults', () => {
      const loadCaseData: LoadCaseData[] = [
        {
          loadCaseName: 'Test',
          operatingTime: 0,
          load: { axialLoad: 0, radialLoad: 0 },
          operatingTemperature: 0,
          force: undefined as any,
          moment: undefined as any,
          rotation: {
            typeOfMotion: 'LB_ROTATING',
            shiftFrequency: undefined as any,
            shiftAngle: undefined as any,
            rotationalSpeed: undefined as any,
          },
        },
      ];

      const result =
        catalogService['getSlewingBearingLoadcaseData'](loadCaseData);

      expect(result[0].IDLD_FX).toBe('0');
      expect(result[0].IDLD_FY).toBe('0');
      expect(result[0].IDLD_MX).toBe('0');
      expect(result[0].IDLD_MY).toBe('0');
      expect(result[0].IDSLC_N_OSC_LIMITED).toBe('1');
      expect(result[0].IDSLC_OPERATING_ANGLE).toBe('0');
      expect(result[0].IDSLC_N_LIMITED).toBe('0');
    });
  });

  describe('convertDefinitionOfViscosity', () => {
    it('should select typeOfGrease', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'grease',
          grease: {
            selection: 'typeOfGrease',
          },
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertDefinitionOfViscosity'](
        lubricationConditions
      );

      expect(result).toEqual('LB_ARCANOL_GREASE');
    });

    it('should select isoVgClass', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'oilBath',
          oilBath: {
            selection: 'isoVgClass',
          },
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertDefinitionOfViscosity'](
        lubricationConditions
      );

      expect(result).toEqual('LB_ISO_VG_CLASS');
    });
  });

  describe('convertLubricationMethod', () => {
    it('should select grease', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'grease',
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertLubricationMethod'](
        lubricationConditions
      );

      expect(result).toEqual('LB_GREASE_LUBRICATION');
    });

    it('should select oil mist', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'oilMist',
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertLubricationMethod'](
        lubricationConditions
      );

      expect(result).toEqual('LB_OIL_MIST_LUBRICATION');
    });
  });

  describe('convertIsoVgClass', () => {
    it('should convert iso vg class', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'oilBath',
          oilBath: {
            selection: 'isoVgClass',

            isoVgClass: { isoVgClass: 1223 },
          },
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertIsoVgClass'](lubricationConditions);

      expect(result).toEqual('LB_ISO_VG_1223');
    });
  });

  describe('getCalculationResult', () => {
    let loadcaseData: CatalogServiceLoadCaseData[];
    let operationConditions: CalculationParametersOperationConditions;
    const bearing = 'test';

    beforeEach(() => {
      operationConditions =
        APP_STATE_MOCK.calculationParameters.operationConditions;

      loadcaseData = [
        {
          IDCO_DESIGNATION: '',
          IDSLC_TIME_PORTION: '60',
          IDSLC_AXIAL_LOAD: `${operationConditions.loadCaseData?.[0].load?.axialLoad}`,
          IDSLC_RADIAL_LOAD: '0',
          IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE: `${operationConditions.loadCaseData?.[0].operatingTemperature}`,
          IDSLC_TYPE_OF_MOVEMENT: 'LB_ROTATING',
          IDLC_SPEED: `${operationConditions.loadCaseData?.[0].rotation.rotationalSpeed}`,
          IDSLC_MOVEMENT_FREQUENCY: '0',
          IDSLC_OPERATING_ANGLE: `${operationConditions.loadCaseData?.[0].rotation.shiftAngle}`,
        },
      ];

      catalogService['getCalculationResultReport'] = jest.fn(() =>
        of({} as BearinxOnlineResult)
      );

      catalogService['getCatalogBearingLoadCasesData'] = jest.fn(
        () => loadcaseData
      );
    });
    describe('when lubrication method is grease lubriction', () => {
      it('should call calculate endpoint', waitForAsync(() => {
        catalogService
          .getCalculationResult(
            bearing,
            operationConditions,
            CATALOG_BEARING_TYPE
          )
          .subscribe((result) => {
            expect(result).toBeTruthy();
            expect(
              catalogService['getCalculationResultReport']
            ).toHaveBeenCalledWith('result');
            expect(convertCatalogCalculationResult).toHaveBeenCalledWith(
              {} as BearinxOnlineResult,
              undefined,
              false,
              false
            );
            expect(result).toEqual({} as CatalogCalculationResult);
          });
        const req = httpMock.expectOne(
          `${catalogService['baseUrl']}/product/calculate/${bearing}`
        );
        expect(req.request.body).toMatchSnapshot();
        expect(req.request.method).toBe('POST');

        req.flush('result');
      }));
    });

    describe('when lubrication method is recirculating oil', () => {
      it('should call calculate endpoint', waitForAsync(() => {
        operationConditions.lubrication.lubricationSelection =
          'recirculatingOil';

        catalogService
          .getCalculationResult(
            bearing,
            operationConditions,
            CATALOG_BEARING_TYPE
          )
          .subscribe((result) => {
            expect(result).toBeTruthy();
            expect(
              catalogService['getCalculationResultReport']
            ).toHaveBeenCalledWith('result');
            expect(convertCatalogCalculationResult).toHaveBeenCalledWith(
              {} as BearinxOnlineResult,
              undefined,
              false,
              false
            );
            expect(result).toEqual({} as CatalogCalculationResult);
          });
        const req = httpMock.expectOne(
          `${catalogService['baseUrl']}/product/calculate/${bearing}`
        );
        expect(req.request.body).toMatchSnapshot();
        expect(req.request.method).toBe('POST');

        req.flush('result');
      }));
    });

    describe('when lubrication method is oil bath', () => {
      it('should call calculate endpoint', waitForAsync(() => {
        operationConditions.lubrication.lubricationSelection = 'oilBath';

        catalogService
          .getCalculationResult(
            bearing,
            operationConditions,
            CATALOG_BEARING_TYPE
          )
          .subscribe((result) => {
            expect(result).toBeTruthy();
            expect(
              catalogService['getCalculationResultReport']
            ).toHaveBeenCalledWith('result');
            expect(convertCatalogCalculationResult).toHaveBeenCalledWith(
              {} as BearinxOnlineResult,
              undefined,
              false,
              false
            );
            expect(result).toEqual({} as CatalogCalculationResult);
          });
        const req = httpMock.expectOne(
          `${catalogService['baseUrl']}/product/calculate/${bearing}`
        );
        expect(req.request.body).toMatchSnapshot();
        expect(req.request.method).toBe('POST');

        req.flush('result');
      }));
    });
    describe('getBearinxVersions', () => {
      it('should combine data from bearinx versions and catalog version APIs', waitForAsync(() => {
        const mockBearinxVersions = [
          {
            name: 'bearinx',
            version: '1.0.0',
          },
          {
            name: 'skf',
            version: '2.3.4',
          },
        ];

        const mockCatalogVersion: CatalogVersionInfoResponse = {
          applicationVersion: '3.2.1',
          bearinxVersion: '10.0.5',
          runtimeFrameworkName: 'dotnet',
          runtimeFrameworkVersion: '1.1.1',
        };

        const expected = {
          applicationVersion: '3.2.1',
          bearinxVersions: '10.0.5',
          bearinx: '1.0.0',
          skf: '2.3.4',
        };

        firstValueFrom(catalogService.getBearinxVersions()).then((res) => {
          expect(res).toEqual(expected);
        });

        // Handle first request to bearinxVersionUrl
        const bearinxVersionReq = httpMock.expectOne(
          catalogService.bearinxVersionUrl
        );
        expect(bearinxVersionReq.request.method).toBe('GET');
        bearinxVersionReq.flush(mockBearinxVersions);

        // Handle second request to catalogVersionUrl
        const catalogVersionReq = httpMock.expectOne(
          catalogService['catalogVersionUrl']
        );
        expect(catalogVersionReq.request.method).toBe('GET');
        catalogVersionReq.flush(mockCatalogVersion);
      }));

      it('should handle empty response from bearinx versions API', waitForAsync(() => {
        const mockBearinxVersions = [
          {
            name: 'bearinx',
            version: '1.0.0',
          },
        ];

        const mockCatalogVersion: CatalogVersionInfoResponse = {
          applicationVersion: '3.2.1',
          bearinxVersion: '10.0.5',
          runtimeFrameworkName: 'dotnet',
          runtimeFrameworkVersion: '1.1.1',
        };

        const expected = {
          applicationVersion: '3.2.1',
          bearinxVersions: '10.0.5',
          bearinx: '1.0.0',
        };

        firstValueFrom(catalogService.getBearinxVersions()).then((res) => {
          expect(res).toEqual(expected);
        });

        const bearinxVersionReq = httpMock.expectOne(
          catalogService.bearinxVersionUrl
        );
        bearinxVersionReq.flush(mockBearinxVersions);

        const catalogVersionReq = httpMock.expectOne(
          catalogService['catalogVersionUrl']
        );
        catalogVersionReq.flush(mockCatalogVersion);
      }));
    });

    describe('when calculation has errors', () => {
      it('should handle calculation errors', waitForAsync(() => {
        const mockResponse = {
          data: {
            message: 'Calculation failed',
            errors: [{ message: 'Invalid input' }],
          },
          _links: [{ rel: 'json', href: 'https://example.com/report.json' }],
        };

        catalogService['getCalculationResultReport'] = jest.fn(() =>
          of({} as BearinxOnlineResult)
        );

        catalogService
          .getCalculationResult(
            'test-bearing',
            operationConditions,
            CATALOG_BEARING_TYPE
          )
          .subscribe((result) => {
            expect(result).toBeDefined();
          });

        const req = httpMock.expectOne(
          `${catalogService['baseUrl']}/product/calculate/test-bearing`
        );
        req.flush(mockResponse);
      }));
    });

    describe('when bearing class is slewing bearing', () => {
      it('should handle slewing bearing calculations', waitForAsync(() => {
        const slewingOperationConditions: CalculationParametersOperationConditions =
          {
            ...operationConditions,
            loadCaseData: [
              {
                loadCaseName: 'Slewing Test',
                operatingTime: 100,
                load: { axialLoad: 0, radialLoad: 0 },
                operatingTemperature: 80,
                force: { fx: 500, fy: 600 },
                moment: { mx: 1000, my: 1200 },
                rotation: {
                  typeOfMotion: 'LB_ROTATING' as const,
                  rotationalSpeed: 100,
                  shiftFrequency: 10,
                  shiftAngle: 90,
                },
              },
            ],
          };

        catalogService['getCalculationResultReport'] = jest.fn(() =>
          of({} as BearinxOnlineResult)
        );

        catalogService
          .getCalculationResult(
            'slewing-bearing',
            slewingOperationConditions,
            SLEWING_BEARING_TYPE
          )
          .subscribe((result) => {
            expect(result).toBeDefined();
          });

        const req = httpMock.expectOne(
          `${catalogService['baseUrl']}/product/calculate/slewing-bearing`
        );

        // Should have empty operating conditions for slewing bearings
        expect(req.request.body.operatingConditions).toEqual({});
        req.flush({ _links: [{ rel: 'json', href: 'test.json' }] });
      }));
    });

    it('should throw error when no bearing id is provided', () => {
      const result$ = catalogService.getCalculationResult(
        '',
        operationConditions,
        CATALOG_BEARING_TYPE
      );

      return expect(firstValueFrom(result$)).rejects.toThrow(
        'bearingId must be provided'
      );
    });
  });

  describe('convertDefinitionOfViscosity edge cases', () => {
    it('should select viscosity', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'oilBath',
          oilBath: {
            selection: 'viscosity',
          },
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertDefinitionOfViscosity'](
        lubricationConditions
      );

      expect(result).toEqual('LB_ENTER_VISCOSITIES');
    });

    it('should throw error for unsupported definition', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'oilBath',
          oilBath: {
            selection: 'unsupported' as any,
          },
        } as CalculationParametersOperationConditions['lubrication'];

      expect(() => {
        catalogService['convertDefinitionOfViscosity'](lubricationConditions);
      }).toThrow('Unsupported definition of viscosity: unsupported');
    });
  });

  describe('convertLubricationMethod edge cases', () => {
    it('should select oil bath', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'oilBath',
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertLubricationMethod'](
        lubricationConditions
      );

      expect(result).toEqual('LB_OIL_BATH_LUBRICATION');
    });

    it('should select recirculating oil', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'recirculatingOil',
        } as CalculationParametersOperationConditions['lubrication'];

      const result = catalogService['convertLubricationMethod'](
        lubricationConditions
      );

      expect(result).toEqual('LB_RECIRCULATING_OIL_LUBRICATION');
    });

    it('should throw error for unsupported lubrication method', () => {
      const lubricationConditions: CalculationParametersOperationConditions['lubrication'] =
        {
          lubricationSelection: 'unsupported' as any,
        } as CalculationParametersOperationConditions['lubrication'];

      expect(() => {
        catalogService['convertLubricationMethod'](lubricationConditions);
      }).toThrow('Unsupported lubrication method: unsupported');
    });
  });

  describe('getOperatingConditionsData', () => {
    it('should handle grease lubrication with type of grease', () => {
      const operationConditions: CalculationParametersOperationConditions = {
        ...APP_STATE_MOCK.calculationParameters.operationConditions,
        lubrication: {
          lubricationSelection: 'grease',
          grease: {
            selection: 'typeOfGrease',
            typeOfGrease: { typeOfGrease: 'ARCANOL_TEMP90' },
            environmentalInfluence: 'LB_HIGH_AMBIENT_INFLUENCE',
          },
          recirculatingOil: {
            oilFlow: 0,
            oilTemperatureDifference: 0,
            externalHeatFlow: 0,
          },
        } as any,
      };

      const result =
        catalogService['getOperatingConditionsData'](operationConditions);

      expect(result).toMatchObject({
        IDL_LUBRICATION_METHOD: 'LB_GREASE_LUBRICATION',
        IDL_DEFINITION_OF_VISCOSITY: 'LB_ARCANOL_GREASE',
        IDL_GREASE: 'ARCANOL_TEMP90',
        IDL_INFLUENCE_OF_AMBIENT: 'LB_HIGH_AMBIENT_INFLUENCE',
      });
    });

    it('should handle recirculating oil with all parameters', () => {
      const operationConditions: CalculationParametersOperationConditions = {
        ...APP_STATE_MOCK.calculationParameters.operationConditions,
        lubrication: {
          lubricationSelection: 'recirculatingOil',
          recirculatingOil: {
            selection: 'viscosity',
            viscosity: { ny40: 100, ny100: 50 },
            oilFlow: 10,
            oilTemperatureDifference: 25,
            externalHeatFlow: 500,
          },
        } as any,
      };

      const result =
        catalogService['getOperatingConditionsData'](operationConditions);

      expect(result).toMatchObject({
        IDL_LUBRICATION_METHOD: 'LB_RECIRCULATING_OIL_LUBRICATION',
        IDL_DEFINITION_OF_VISCOSITY: 'LB_ENTER_VISCOSITIES',
        IDL_NY_40: '100',
        IDL_NY_100: '50',
        IDL_OIL_FLOW: '10',
        IDL_OIL_TEMPERATURE_DIFFERENCE: '25',
        IDL_EXTERNAL_HEAT_FLOW: '500',
      });
    });

    it('should handle oil bath with ISO VG class', () => {
      const operationConditions: CalculationParametersOperationConditions = {
        ...APP_STATE_MOCK.calculationParameters.operationConditions,
        lubrication: {
          lubricationSelection: 'oilBath',
          oilBath: {
            selection: 'isoVgClass',
            isoVgClass: { isoVgClass: 46 },
          },
          recirculatingOil: {
            oilFlow: 0,
            oilTemperatureDifference: 0,
            externalHeatFlow: 0,
          },
        } as any,
      };

      const result =
        catalogService['getOperatingConditionsData'](operationConditions);

      expect(result).toMatchObject({
        IDL_LUBRICATION_METHOD: 'LB_OIL_BATH_LUBRICATION',
        IDL_DEFINITION_OF_VISCOSITY: 'LB_ISO_VG_CLASS',
        IDL_ISO_VG_CLASS: 'LB_ISO_VG_46',
        IDL_GREASE: 'LB_PLEASE_SELECT',
      });
    });

    it('should handle condition of rotation for outer ring', () => {
      const operationConditions: CalculationParametersOperationConditions = {
        ...APP_STATE_MOCK.calculationParameters.operationConditions,
        conditionOfRotation: 'outerring',
      };

      const result =
        catalogService['getOperatingConditionsData'](operationConditions);

      expect(result).toMatchObject({
        IDL_CONDITION_OF_ROTATION: 'LB_ROTATING_OUTERRING',
      });
    });
  });

  describe('getCalculationResult with inputs', () => {
    let loadcaseData: CatalogServiceLoadCaseData[];
    let testOperationConditions: CalculationParametersOperationConditions;

    beforeEach(() => {
      testOperationConditions =
        APP_STATE_MOCK.calculationParameters.operationConditions;
      loadcaseData = [
        {
          IDCO_DESIGNATION: '',
          IDSLC_TIME_PORTION: '60',
          IDSLC_AXIAL_LOAD: `${testOperationConditions.loadCaseData?.[0].load?.axialLoad}`,
          IDSLC_RADIAL_LOAD: '0',
          IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE: `${testOperationConditions.loadCaseData?.[0].operatingTemperature}`,
          IDSLC_TYPE_OF_MOVEMENT: 'LB_ROTATING',
          IDLC_SPEED: `${testOperationConditions.loadCaseData?.[0].rotation.rotationalSpeed}`,
          IDSLC_MOVEMENT_FREQUENCY: '0',
          IDSLC_OPERATING_ANGLE: `${testOperationConditions.loadCaseData?.[0].rotation.shiftAngle}`,
        },
      ];

      catalogService['getCalculationResultReport'] = jest.fn(() =>
        of({} as BearinxOnlineResult)
      );

      catalogService['getCatalogBearingLoadCasesData'] = jest.fn(
        () => loadcaseData
      );
    });

    it('should handle result with inputs and add to report', waitForAsync(() => {
      const mockInputs: CalculationResultReportInput[] = [
        { hasNestedStructure: false, title: 'Input 1', value: '123' },
      ];

      const mockConverterService = spectator.inject(
        CatalogCalculationInputsConverterService
      );
      (
        mockConverterService.convertCatalogInputsResponse as jest.Mock
      ).mockReturnValue(mockInputs);

      catalogService
        .getCalculationResult(
          'test-bearing',
          testOperationConditions,
          CATALOG_BEARING_TYPE
        )
        .subscribe((result) => {
          expect(result.reportInputSuborinates).toBeDefined();
          expect(result.reportInputSuborinates?.inputSubordinates).toEqual(
            mockInputs
          );
        });

      const req = httpMock.expectOne(
        `${catalogService['baseUrl']}/product/calculate/test-bearing`
      );
      req.flush({ _links: [{ rel: 'json', href: 'test.json' }] });
    }));

    it('should handle result without inputs', waitForAsync(() => {
      const mockConverterService = spectator.inject(
        CatalogCalculationInputsConverterService
      );
      (
        mockConverterService.convertCatalogInputsResponse as jest.Mock
      ).mockReturnValue([]);

      catalogService
        .getCalculationResult(
          'test-bearing',
          testOperationConditions,
          CATALOG_BEARING_TYPE
        )
        .subscribe((result) => {
          expect(result.reportInputSuborinates).toBeUndefined();
        });

      const req = httpMock.expectOne(
        `${catalogService['baseUrl']}/product/calculate/test-bearing`
      );
      req.flush({ _links: [{ rel: 'json', href: 'test.json' }] });
    }));
  });

  describe('getOperatingConditionsData edge cases', () => {
    it('should handle oil mist lubrication', () => {
      const operationConditions: CalculationParametersOperationConditions = {
        ...APP_STATE_MOCK.calculationParameters.operationConditions,
        lubrication: {
          lubricationSelection: 'oilMist',
          oilMist: {
            selection: 'viscosity',
            viscosity: { ny40: 32, ny100: 5.2 },
          },
          recirculatingOil: {
            oilFlow: 0,
            oilTemperatureDifference: 0,
            externalHeatFlow: 0,
          },
        } as any,
      };

      const result =
        catalogService['getOperatingConditionsData'](operationConditions);

      expect(result).toMatchObject({
        IDL_LUBRICATION_METHOD: 'LB_OIL_MIST_LUBRICATION',
        IDL_DEFINITION_OF_VISCOSITY: 'LB_ENTER_VISCOSITIES',
        IDL_NY_40: '32',
        IDL_NY_100: '5.2',
      });
    });

    it('should handle non-recirculating oil lubrication (no oil flow params)', () => {
      const operationConditions: CalculationParametersOperationConditions = {
        ...APP_STATE_MOCK.calculationParameters.operationConditions,
        lubrication: {
          lubricationSelection: 'grease',
          grease: {
            selection: 'typeOfGrease',
            typeOfGrease: { typeOfGrease: 'ARCANOL_TEMP90' },
            environmentalInfluence: 'LB_HIGH_AMBIENT_INFLUENCE',
          },
          recirculatingOil: {
            oilFlow: 10,
            oilTemperatureDifference: 25,
            externalHeatFlow: 500,
          },
        } as any,
      };

      const result =
        catalogService['getOperatingConditionsData'](operationConditions);

      expect(result).toMatchObject({
        IDL_LUBRICATION_METHOD: 'LB_GREASE_LUBRICATION',
        IDL_OIL_FLOW: undefined,
        IDL_OIL_TEMPERATURE_DIFFERENCE: undefined,
        IDL_EXTERNAL_HEAT_FLOW: undefined,
      });
    });
  });

  describe('Additional edge cases', () => {
    it('should handle load case data with zero values', () => {
      const loadCaseData: LoadCaseData[] = [
        {
          loadCaseName: 'Zero Test',
          operatingTime: 0,
          load: {
            axialLoad: 0,
            radialLoad: 0,
          },
          operatingTemperature: 0,
          rotation: {
            typeOfMotion: 'LB_ROTATING',
            rotationalSpeed: 0,
            shiftFrequency: 0,
            shiftAngle: 0,
          },
          force: { fx: 0, fy: 0 },
          moment: { mx: 0, my: 0 },
        },
      ];

      const result =
        catalogService['getCatalogBearingLoadCasesData'](loadCaseData);

      expect(result[0]).toMatchObject({
        IDSLC_AXIAL_LOAD: '0',
        IDSLC_RADIAL_LOAD: '0',
        IDLC_SPEED: '0',
        IDSLC_MOVEMENT_FREQUENCY: '0',
        IDSLC_OPERATING_ANGLE: '0',
      });
    });

    it('should handle missing operatingTime in load case data', () => {
      const loadCaseData: LoadCaseData[] = [
        {
          loadCaseName: 'Missing Time',
          operatingTime: undefined as any,
          load: { axialLoad: 100, radialLoad: 200 },
          operatingTemperature: 80,
          rotation: {
            typeOfMotion: 'LB_ROTATING',
            rotationalSpeed: 1500,
            shiftFrequency: 10,
            shiftAngle: 90,
          },
          force: { fx: 0, fy: 0 },
          moment: { mx: 0, my: 0 },
        },
      ];

      const result =
        catalogService['getCatalogBearingLoadCasesData'](loadCaseData);

      expect(result[0].IDSLC_TIME_PORTION).toBe('100'); // Single load case should be 100%
    });
  });
});
