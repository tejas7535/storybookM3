import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator';

import { CUSTOMER_MOCK } from '../../../../../testing/mocks';
import { QuotationIdentifier } from '../../../../core/store/reducers/models';
import { ApiVersion } from '../../../../shared/models';
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
});
