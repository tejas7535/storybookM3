import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { DataService } from '../../core/http/data.service';
import { ENV_CONFIG } from '../../core/http/environment-config.interface';
import { QuotationDetailsService } from './quotation-details.service';

describe('QuotationDetailsService', (): void => {
  let service: QuotationDetailsService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        QuotationDetailsService,
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
    service = TestBed.inject(QuotationDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('quotationDetails', () => {
    test('should call ', () => {
      const quotationNumber = '123456';

      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.getQuotation(quotationNumber).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne('/quotations/123456');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
