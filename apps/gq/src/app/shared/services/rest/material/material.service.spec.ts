import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { VALIDATION_CODE } from '@gq/shared/models/table/customer-validation-info.enum';
import { MaterialValidation } from '@gq/shared/models/table/material-validation.model';
import { ValidationDescription } from '@gq/shared/models/table/validation-description.enum';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApiVersion } from '../../../models';
import { MaterialService } from './material.service';
import {
  AddDetailsValidationRequest,
  MaterialAutoComplete,
  MaterialAutoCompleteResponse,
  Severity,
  ValidatedDetail,
} from './models';
describe('MaterialService', () => {
  let httpMock: HttpTestingController;
  let spectator: SpectatorService<MaterialService>;
  let service: MaterialService;

  const createService = createServiceFactory({
    service: MaterialService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('validateDetailsToAdd', () => {
    test('should call', () => {
      const request: AddDetailsValidationRequest = {
        customerId: { customerId: '12345', salesOrg: '0815' },
        details: [
          {
            id: 1,
            data: {
              materialNumber15: '1234',
              quantity: 1,
            },
          },
        ],
      };

      service.validateDetailsToAdd(request).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_ADD_DETAILS_VALIDATION']}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(request);
    });
    test('should extract materialNumbers', () => {
      const request: AddDetailsValidationRequest = {
        customerId: { customerId: '12345', salesOrg: '0815' },
        details: [
          {
            id: 1,
            data: {
              materialNumber15: '1234',
              quantity: 1,
            },
          },
        ],
      };
      service['http'].post = jest.fn();

      service.validateDetailsToAdd(request);

      expect(service['http'].post).toHaveBeenCalledWith(
        `${ApiVersion.V1}/${service['PATH_ADD_DETAILS_VALIDATION']}`,
        request
      );
    });
  });

  describe('getMaterialStock', () => {
    test('should call', () => {
      const productionPlantId = '0215';
      const materialNumber15 = '123456789012345';

      service
        .getMaterialStock(productionPlantId, materialNumber15)
        .subscribe((response) => {
          expect(response).toEqual([]);
        });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_MATERIAL_STOCK']}?${service['PRODUCTION_PLANT_PARAM_KEY']}=${productionPlantId}&${service['MATERIAL_NUMBER_PARAM_KEY']}=${materialNumber15}`
      );

      expect(req.request.method).toBe('GET');
    });
  });

  describe('getPlantMaterialDetails', () => {
    test('should call', () => {
      const materialNumber15 = '123';
      const plantIds = ['456', '789'];

      service
        .getPlantMaterialDetails(materialNumber15, plantIds)
        .subscribe((response) => {
          expect(response).toEqual([]);
        });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/materials/${materialNumber15}/plant-material-details`
      );

      expect(req.request.method).toBe('POST');
    });

    test('should extract plantIds', () => {
      const materialNumber15 = '123';
      const plantIds = ['456', '789'];
      service['http'].post = jest.fn().mockReturnValue(of([]));

      service.getPlantMaterialDetails(materialNumber15, plantIds);

      expect(service['http'].post).toHaveBeenCalledWith(
        `${ApiVersion.V1}/materials/${materialNumber15}/plant-material-details`,
        { plantIds }
      );
    });
  });

  describe('getMaterialCostDetails', () => {
    test('should call', () => {
      const productionPlantId = '0215';
      const plantId = '123';
      const materialNumber15 = '123456789012345';
      const currency = 'EUR';

      service
        .getMaterialCostDetails(
          productionPlantId,
          plantId,
          materialNumber15,
          currency,
          1
        )
        .subscribe((response) => {
          expect(response).toEqual([]);
        });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/materials/${materialNumber15}/material-cost-details?${service['PRODUCTION_PLANT_PARAM_KEY']}=${productionPlantId}&${service['PLANT_ID_PARAM_KEY']}=${plantId}&${service['CURRENCY_PARAM_KEY']}=${currency}&${service['PRICE_UNIT_PARAM_KEY']}=1`
      );

      expect(req.request.method).toBe('GET');
    });
  });
  describe('autocompleteMaterial', () => {
    test('should call', () => {
      const autocompleteSearch = {
        searchFor: 'search',
        filter: 'filter',
        limit: 5,
        customerIdentifier: { customerId: '123', salesOrg: '0815' },
      };

      service.autocompleteMaterial(autocompleteSearch).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_AUTOCOMPLETE']}/${autocompleteSearch.filter}?${service['PARAM_SEARCH_FOR']}=${autocompleteSearch.searchFor}&${service['PARAM_LIMIT']}=${autocompleteSearch?.limit || 100}&${service['PARAM_CUSTOMER_ID']}=${autocompleteSearch.customerIdentifier.customerId}&${service['PARAM_SALES_ORG']}=${autocompleteSearch.customerIdentifier.salesOrg}`
      );

      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
    test('should map the result', () => {
      const mapSpy = jest.spyOn(miscUtils, 'mapMaterialAutocompleteToIdValue');
      const response: MaterialAutoCompleteResponse = {
        results: [
          {
            customerMaterial: 'customerMaterial',
            materialDescription: 'materialDescription',
            materialNumber15: 'materialNumber15',
          } as MaterialAutoComplete,
        ],
      };
      const autocompleteSearch = {
        searchFor: 'search',
        filter: FilterNames.CUSTOMER_MATERIAL,
        limit: 5,
        customerIdentifier: { customerId: '123', salesOrg: '0815' },
      };

      service.autocompleteMaterial(autocompleteSearch).subscribe(() => {
        expect(mapSpy).toHaveBeenCalled();
      });
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_AUTOCOMPLETE']}/${autocompleteSearch.filter}?${service['PARAM_SEARCH_FOR']}=${autocompleteSearch.searchFor}&${service['PARAM_LIMIT']}=${autocompleteSearch?.limit || 100}&${service['PARAM_CUSTOMER_ID']}=${autocompleteSearch.customerIdentifier.customerId}&${service['PARAM_SALES_ORG']}=${autocompleteSearch.customerIdentifier.salesOrg}`
      );
      req.flush(response);
    });
  });

  describe('mapToAddDetailsValidationRequest', () => {
    test('create AddDetailsValidationRequest', () => {
      const customer = { customerId: '12345', salesOrg: '0615' };
      const tableData = [
        {
          id: 1,
          materialNumber: '1234',
          materialDescription: 'matDESC',
          customerMaterialNumber: '1234_customer',
          quantity: 20,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];
      const expected = {
        customerId: customer,
        details: [
          {
            id: 1,
            data: {
              materialNumber15: '1234',
              customerMaterial: '1234_customer',
              quantity: 20,
            },
          },
        ],
      };
      const result = service.mapToAddDetailsValidationRequest(
        customer,
        tableData
      );
      expect(result).toEqual(expected);
    });
  });

  describe('mapValidatedDetailToMaterialValidation', () => {
    test('map ValidatedDetail to MaterialValidation', () => {
      const validatedDetail = {
        id: 1,
        userInput: {
          materialNumber15: 'MatNummer',
          quantity: 4,
          customerMaterial: 'CustMatNummer',
        },
        materialData: {
          materialNumber15: 'MatNummer',
          materialDescription: 'MatDesc',
          materialPriceUnit: 1,
          materialUoM: 'PC',
        },
        customerData: {
          correctedQuantity: 7,
          customerMaterial: 'CustMatNummer',
          deliveryUnit: 5,
        },
        valid: true,
        validationCodes: [
          {
            code: VALIDATION_CODE.QDV001,
            description: 'quantatiy updated',
            severity: Severity.INFO,
          },
        ],
      } as ValidatedDetail;
      const expected = {
        id: 1,
        valid: true,
        deliveryUnit: 5,
        materialNumber15: 'MatNummer',
        customerMaterial: 'CustMatNummer',
        correctedQuantity: 7,
        materialDescription: 'MatDesc',
        materialPriceUnit: 1,
        materialUoM: 'PC',
        validationCodes: [
          {
            code: VALIDATION_CODE.QDV001,
            description: 'quantatiy updated',
            severity: Severity.INFO,
          },
        ],
      } as MaterialValidation;
      const result =
        service.mapValidatedDetailToMaterialValidation(validatedDetail);
      expect(result).toEqual(expected);
    });
  });
});
