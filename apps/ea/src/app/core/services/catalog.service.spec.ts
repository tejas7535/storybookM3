import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom, of } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  CalculationParametersOperationConditions,
  CatalogCalculationResult,
  ProductCapabilitiesResult,
} from '../store/models';
import { BearinxOnlineResult } from './bearinx-result.interface';
import { CatalogService } from './catalog.service';
import {
  CatalogServiceBasicFrequenciesResult,
  CatalogServiceLoadCaseData,
} from './catalog.service.interface';
import { CatalogCalculationInputsConverterService } from './catalog-calculation-inputs-converter.service';
import { convertCatalogCalculationResult } from './catalog-helper';

jest.mock('./catalog-helper', () => ({
  ...jest.requireActual('./catalog-helper'),
  convertCatalogCalculationResult: jest.fn(
    () => ({} as CatalogCalculationResult)
  ),
}));

describe('CatalogService', () => {
  let catalogService: CatalogService;
  let spectator: SpectatorService<CatalogService>;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.catalogApiBaseUrl}/v1/CatalogBearing`;

  const createService = createServiceFactory({
    service: CatalogService,
    imports: [HttpClientTestingModule],
    providers: [
      CatalogService,
      {
        provide: CatalogCalculationInputsConverterService,
        useValue: {
          convertCatalogInputsResponse: jest.fn(() => []),
        },
      },
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
          bearinxClass: 'IDO_CATALOGUE_BEARING',
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
    it('should call calculate endpoint', waitForAsync(() => {
      catalogService['getCalculationResultReport'] = jest.fn(() =>
        of({} as BearinxOnlineResult)
      );

      const bearing = 'test';
      const operationConditions =
        APP_STATE_MOCK.calculationParameters.operationConditions;
      const loadcaseData: CatalogServiceLoadCaseData[] = [
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
      catalogService['getLoadCasesData'] = jest.fn(() => loadcaseData);
      const expectedBody = {
        operatingConditions: {
          IDL_LUBRICATION_METHOD: 'LB_GREASE_LUBRICATION',
          IDL_INFLUENCE_OF_AMBIENT: 'LB_AVERAGE_AMBIENT_INFLUENCE',
          IDL_CLEANESS_VALUE: operationConditions.contamination,
          IDSLC_TEMPERATURE: `${operationConditions.ambientTemperature}`,
          IDL_DEFINITION_OF_VISCOSITY: 'LB_ISO_VG_CLASS',
          IDL_ISO_VG_CLASS: 'LB_ISO_VG_undefined',
          IDL_GREASE: 'LB_PLEASE_SELECT',
          IDL_NY_40: '0',
          IDL_NY_100: '0',
          IDL_CONDITION_OF_ROTATION: 'LB_ROTATING_INNERRING',

          IDL_OIL_FLOW: '0',
          IDL_OIL_TEMPERATURE_DIFFERENCE: `${operationConditions.lubrication.recirculatingOil.oilTemperatureDifference}`,
          IDL_EXTERNAL_HEAT_FLOW: `${operationConditions.lubrication.recirculatingOil.externalHeatFlow}`,
        },
        loadcaseData,
      };

      catalogService
        .getCalculationResult(bearing, operationConditions)
        .subscribe((result) => {
          expect(result).toBeTruthy();
          expect(
            catalogService['getCalculationResultReport']
          ).toHaveBeenCalledWith('result');
          expect(convertCatalogCalculationResult).toHaveBeenCalledWith(
            {} as BearinxOnlineResult,
            undefined,
            false
          );
          expect(result).toEqual({} as CatalogCalculationResult);
        });
      const req = httpMock.expectOne(
        `${catalogService['baseUrl']}/product/calculate/${bearing}`
      );
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('POST');

      req.flush('result');
    }));
  });
});
