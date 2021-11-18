import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApiVersion } from '../../../models';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { MaterialService } from './material.service';

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
      const mockTable: MaterialTableItem[] = [
        {
          materialNumber: '123',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];
      service.validateMaterials(mockTable).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne(`${ApiVersion.V1}/materials/validation`);
      expect(req.request.method).toBe('POST');
      req.flush(mockTable);
    });
    test('should extract materialNumbers', () => {
      const mockTable: MaterialTableItem[] = [
        {
          materialNumber: '123',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];
      service['http'].post = jest.fn();

      service.validateMaterials(mockTable);

      expect(service['http'].post).toHaveBeenCalledWith(
        `${ApiVersion.V1}/${service['PATH_VALIDATION']}`,
        [mockTable[0].materialNumber]
      );
    });
  });
});
