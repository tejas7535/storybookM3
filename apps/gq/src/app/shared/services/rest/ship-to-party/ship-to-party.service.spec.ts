import { HttpParams, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import { ShipToPartyResponse } from '@gq/shared/models/ship-to-party.model';
import { QuotationPaths } from '@gq/shared/services/rest/quotation/models/quotation-paths.enum';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { ShipToPartyService } from './ship-to-party.service';

describe('ShipToPartyService', () => {
  let service: ShipToPartyService;
  let spectator: SpectatorService<ShipToPartyService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ShipToPartyService,
    imports: [],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getShipToParties', () => {
    test('should call endpoint to get all ship to parties by customer id and sales org', () => {
      const customerId = '12345';
      const salesOrg = '0615';

      const expectedResult: ShipToPartyResponse = {
        results: [
          {
            customerId: '12345',
            salesOrg: '0615',
            customerName: 'Ship to party 1',
            countryName: 'Country 1',
            defaultCustomer: true,
          },
        ],
      };

      const expectedParams = new HttpParams()
        .set('customer-id', customerId)
        .set('sales-org', salesOrg);

      service
        .getShipToParties(customerId, salesOrg)
        .subscribe((res) => expect(res).toEqual(expectedResult));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.SHIP_TO_PARTY}?${expectedParams.toString()}`
      );

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });
});
