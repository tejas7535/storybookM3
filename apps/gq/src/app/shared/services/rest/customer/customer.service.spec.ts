import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { QuotationIdentifier } from '@gq/core/store/active-case/models';
import { ApiVersion } from '@gq/shared/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { CUSTOMER_MOCK } from '../../../../../testing/mocks';
import { SearchPaths } from '../search/models/search-paths.enum';
import { CustomerService } from './customer.service';
import { CustomerPaths } from './models/customer-paths.enum';

describe('CustomerService', () => {
  let service: CustomerService;
  let spectator: SpectatorService<CustomerService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CustomerService,
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

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSalesOrgsAndCurrenciesByCustomer', () => {
    test('should call with correct path', () => {
      const customerId = '123456';
      service.getSalesOrgsAndCurrenciesByCustomer(customerId).subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${CustomerPaths.PATH_CUSTOMER}/${customerId}/${CustomerPaths.PATH_SALES_ORGS_CURRENCIES}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(customerId);
    });
  });

  describe('getCustomer', () => {
    test('should call', () => {
      const quotationIdentifier: QuotationIdentifier = {
        customerNumber: '1234',
        gqId: 1_147_852,
        salesOrg: '0267',
      };
      const mock = {
        customerDetails: CUSTOMER_MOCK,
      };
      service.getCustomer(quotationIdentifier).subscribe((response) => {
        expect(response).toEqual(mock.customerDetails);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SearchPaths.PATH_CUSTOMERS}/1234/0267`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
  });

  describe('getSectorGpsdsByCustomerAndSalesOrg', () => {
    test('should call and map', () => {
      const customerId = '123456';
      const salesOrg = '0267';
      const response = {
        results: [
          { id: '1', name: 'gpsd1' },
          { id: '2', name: 'gpsd2' },
        ],
      };
      service
        .getSectorGpsdsByCustomerAndSalesOrg(customerId, salesOrg)
        .subscribe((data) => expect(data).toEqual(response.results));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${CustomerPaths.PATH_CUSTOMER}/${customerId}/${salesOrg}/${CustomerPaths.PATH_END_CUSTOMERS_OR_SECTORS}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(response);
    });
  });
});
