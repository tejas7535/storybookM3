import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { ENV_CONFIG } from '@schaeffler/http';

import { CUSTOMER_MOCK } from '../../../../../testing/mocks';
import { CreateCase } from '../../../../core/store/reducers/create-case/models';
import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { CreateCustomerCase } from '../search-service/models/create-customer-case.model';
import { QuotationService } from './quotation.service';

describe('QuotationService', () => {
  let service: QuotationService;
  let spectator: SpectatorService<QuotationService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: QuotationService,
    imports: [HttpClientTestingModule],
    providers: [
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

  describe('uploadSelectionToSap', () => {
    test('should call DataService POST', () => {
      const gqPositionIds = ['1', '2', '3'];
      service
        .uploadSelectionToSap(gqPositionIds)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(`/${service['PATH_UPLOAD_SELECTION']}`);
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(gqPositionIds);
    });
  });
  describe('refreshSapPricing', () => {
    test('should call DataService GET', () => {
      const gqId = 4600;
      service
        .refreshSapPricing(gqId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `/${service['PATH_QUOTATIONS']}/${gqId}/${service['PATH_REFRESH_SAP_PRICING']}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(gqId);
    });
  });

  describe('deleteCase', () => {
    test('should call DataService DELETE', () => {
      const gqId = ['123'];
      service.deleteCases(gqId).subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(`/${service['PATH_QUOTATIONS']}`);
      expect(req.request.method).toBe(HttpMethod.DELETE);
      req.flush(gqId);
    });
  });

  describe('quotationDetails', () => {
    test('should call', () => {
      const gqId = 1000;

      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.getQuotation(gqId).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne(`/${service['PATH_QUOTATIONS']}/${gqId}`);
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
  });

  describe('getCases', () => {
    test('should call DataService getAll', () => {
      service.getCases().subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(`/${service['PATH_QUOTATIONS']}`);
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('createCase', () => {
    test('should call', () => {
      const mockBody: CreateCase = {
        customer: {
          customerId: '1234',
          salesOrg: '0267',
        },
        materialQuantities: [
          { materialId: '123', quantity: 10, quotationItemId: 10 },
        ],
      };
      service.createCase(mockBody).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne(`/${service['PATH_QUOTATIONS']}`);
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(mockBody);
    });
  });

  describe('importCase', () => {
    test('should call', () => {
      const importCase = '1234';
      service.importCase(importCase).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne(`/${service['PATH_QUOTATIONS']}`);
      expect(req.request.method).toBe(HttpMethod.PUT);
      req.flush(importCase);
    });
  });

  describe('createCustomerCase', () => {
    test('should call', () => {
      const mockBody: CreateCustomerCase = {
        customer: {
          customerId: '1234',
          salesOrg: '0267',
        },
        includeQuotationHistory: true,
        productLines: ['1'],
        series: ['2'],
        salesIndications: [SalesIndication.INVOICE],
      };
      service.createCustomerCase(mockBody).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne(`/${service['PATH_CUSTOMER_QUOTATION']}`);
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(mockBody);
    });
  });
});
