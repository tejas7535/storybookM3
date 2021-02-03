import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { SalesOrgsService } from './sales-orgs.service';

describe('SalesOrgsService', () => {
  let service: SalesOrgsService;
  let spectator: SpectatorService<SalesOrgsService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: SalesOrgsService,
    imports: [HttpClientTestingModule],
    providers: [
      SalesOrgsService,
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

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSalesOrgs', () => {
    test('should call', () => {
      const customerId = '123456';
      service.getSalesOrgs(customerId).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(
        `/${service['GET_SALES_ORGS']}?${service['PARAM_CUSTOMER_ID']}=${customerId}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(customerId);
    });
  });
});
