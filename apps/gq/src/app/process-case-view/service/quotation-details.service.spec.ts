import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { configureTestSuite } from 'ng-bullet';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { AddQuotationDetailsRequest } from '../../core/store/models';
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
      const gqId = 123456;

      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.getQuotation(gqId).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne('/quotations/123456');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('addMaterial', () => {
    test('should call ', () => {
      const tableData: AddQuotationDetailsRequest = {
        gqId: 12345,
        items: [
          {
            materialId: '123456',
            quantity: 100,
          },
        ],
      };

      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.addMaterial(tableData).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne('/quotation-details');
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });
  describe('removeMaterial', () => {
    test('should call ', () => {
      const qgPositionIds = ['123456'];

      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.removeMaterial(qgPositionIds).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne('/quotation-details');
      expect(req.request.method).toBe('DELETE');
      req.flush(mock);
    });
  });
});
