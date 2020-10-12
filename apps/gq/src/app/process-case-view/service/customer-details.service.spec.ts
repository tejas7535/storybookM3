import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { CUSTOMER_DETAILS_MOCK } from '../../../testing/mocks';
import { DataService } from '../../core/http/data.service';
import { ENV_CONFIG } from '../../core/http/environment-config.interface';
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
      const customerNumber = '123456';

      const mock = {
        customerDetails: CUSTOMER_DETAILS_MOCK,
      };
      service.customerDetails(customerNumber).subscribe((response) => {
        expect(response).toEqual(mock.customerDetails);
      });

      const req = httpMock.expectOne('/customer-details/123456');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
