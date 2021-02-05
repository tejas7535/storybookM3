import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { QuotationIdentifier } from '../../core/store/models';
import { CustomerDetailsService } from './customer-details.service';

describe('CustomerDetailsService', (): void => {
  let service: CustomerDetailsService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerDetailsService,
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
  });

  beforeEach(() => {
    service = TestBed.inject(CustomerDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('customerDetails', () => {
    test('should call ', () => {
      const quotationIdentifier: QuotationIdentifier = {
        customerNumber: '1234',
        gqId: 1147852,
        salesOrg: '0267',
      };
      const mock = {
        customerDetails: CUSTOMER_MOCK,
      };
      service.getCustomer(quotationIdentifier).subscribe((response) => {
        expect(response).toEqual(mock.customerDetails);
      });

      const req = httpMock.expectOne('/customers/1234/0267');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
