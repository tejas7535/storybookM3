import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CalculationParametersOperationConditions } from '../store/models';
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

  describe('getBearingIdFromDesignation', () => {
    it('should call the service to return a bearing id', waitForAsync(() => {
      const url = `${environment.catalogApiBaseUrl}/v1/CatalogBearing/product/id?designation=abc`;
      const mockResult = { id: 'my-id' };

      firstValueFrom(catalogService.getBearingIdFromDesignation('abc')).then(
        (res) => {
          expect(res).toEqual(mockResult.id);
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));

    it('should throw if no bearing designation is provided', () =>
      expect(
        firstValueFrom(catalogService.getBearingIdFromDesignation(undefined))
      ).rejects.toThrow());
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

  describe('getProductClass', () => {
    it('should return the product class', waitForAsync(() => {
      const rawResult = 'abc-class';
      const url = `${environment.catalogApiBaseUrl}/v1/CatalogBearing/product/classbydesignation?designation=my-id`;

      firstValueFrom(catalogService.getProductClass('my-id')).then((res) => {
        expect(res).toMatchSnapshot();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(rawResult);
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
