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

  describe('uploadOfferToSap', () => {
    test('should call DataService POST', () => {
      const gqId = 123;
      service
        .uploadOfferToSap(gqId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(`/${service['PATH_UPLOAD_OFFER']}`);
      expect(req.request.method).toBe(HttpMethod.POST);
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
    test('should call ', () => {
      const gqId = 123456;

      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.getQuotation(gqId).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne(`/${service['PATH_QUOTATIONS']}/123456`);
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
        materialQuantities: [{ materialId: '123', quantity: 10 }],
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
});
