import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { MaterialService } from './material.service';

describe('ValidationService', () => {
  let httpMock: HttpTestingController;
  let spectator: SpectatorService<MaterialService>;
  let service: MaterialService;

  const createService = createServiceFactory({
    service: MaterialService,
    imports: [HttpClientTestingModule],
    providers: [
      DataService,
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('validate', () => {
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
      const req = httpMock.expectOne('/materials/validation');
      expect(req.request.method).toBe('POST');
      req.flush(mockTable);
    });
  });
});
