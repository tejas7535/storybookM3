import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApiVersion } from '../../../models';
import { MaterialService } from './material.service';
import { MaterialValidationRequest } from './models';

describe('MaterialService', () => {
  let httpMock: HttpTestingController;
  let spectator: SpectatorService<MaterialService>;
  let service: MaterialService;

  const createService = createServiceFactory({
    service: MaterialService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('validateMaterials', () => {
    test('should call', () => {
      const request: MaterialValidationRequest = {
        customerId: { customerId: '12345', salesOrg: '0815' },
        materialNumbers: ['1234'],
      };

      service.validateMaterials(request).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(`${ApiVersion.V1}/materials/validation`);
      expect(req.request.method).toBe('POST');
      req.flush(request);
    });
    test('should extract materialNumbers', () => {
      const request: MaterialValidationRequest = {
        customerId: { customerId: '12345', salesOrg: '0815' },
        materialNumbers: ['1234'],
      };
      service['http'].post = jest.fn();

      service.validateMaterials(request);

      expect(service['http'].post).toHaveBeenCalledWith(
        `${ApiVersion.V1}/${service['PATH_VALIDATION']}`,
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
});
