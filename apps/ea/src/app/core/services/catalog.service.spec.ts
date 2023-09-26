import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  CalculationParametersOperationConditions,
  ProductCapabilitiesResult,
} from '../store/models';
import { CatalogService } from './catalog.service';
import { CatalogServiceBasicFrequenciesResult } from './catalog.service.interface';

describe('CatalogService', () => {
  let catalogService: CatalogService;
  let spectator: SpectatorService<CatalogService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CatalogService,
    imports: [HttpClientTestingModule],
    providers: [CatalogService],
  });

  beforeEach(() => {
    spectator = createService();
    catalogService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(catalogService).toBeDefined();
  });

  describe('getBearingCapabilities', () => {
    it('should call the service to fetch the product capabilities', () => {
      const url = `${environment.catalogApiBaseUrl}/v1/CatalogBearing/product/capabilities?designation=6226`;

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

      // eslint-disable-next-line jest/valid-expect-in-promise
      firstValueFrom(catalogService.getBearingCapabilities('6226')).then(
        (res) => {
          expect(res).toEqual(mockResponse);
        }
      );

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
      const url = `${environment.catalogApiBaseUrl}/v1/CatalogBearing/product/basicfrequencies/my-id`;

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
      const url = `${environment.catalogApiBaseUrl}/v1/CatalogBearing/product/basicfrequencies/pdf/my-id`;
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
});
