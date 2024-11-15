import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { CreateCase, SalesIndication } from '@gq/core/store/reducers/models';
import {
  ApiVersion,
  QuotationStatus,
  SAP_SYNC_STATUS,
} from '@gq/shared/models';
import { SapCallInProgress } from '@gq/shared/models/quotation';
import { QuotationSapSyncStatusResult } from '@gq/shared/models/quotation/quotation-sap-sync-status-result.model';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { CUSTOMER_MOCK } from '../../../../../testing/mocks';
import { CreateCustomerCase } from '../search/models/create-customer-case.model';
import { QuotationPaths } from './models/quotation-paths.enum';
import { ShipToParty } from './models/ship-to-party';
import { UpdateQuotationRequest } from './models/update-quotation-request.model';
import { QuotationService } from './quotation.service';

describe('QuotationService', () => {
  let service: QuotationService;
  let spectator: SpectatorService<QuotationService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: QuotationService,
    imports: [],
    providers: [provideHttpClient(), provideHttpClientTesting()],
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

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_UPLOAD_SELECTION}`
      );
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
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_REFRESH_SAP_PRICING}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(gqId);
    });
  });

  describe('updateCase', () => {
    test('should call DataService PUT', () => {
      const mockBody = {
        gqIds: [123],
        status: QuotationStatus.ARCHIVED,
      };

      service
        .updateCases([123], QuotationStatus.ARCHIVED)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS_STATUS}`
      );
      expect(req.request.method).toBe(HttpMethod.PUT);
      req.flush(mockBody);
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

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
  });

  describe('getSapSyncStatus', () => {
    test('should call', () => {
      const gqId = 1000;

      const mock: QuotationSapSyncStatusResult = {
        sapId: '12345',
        sapSyncStatus: SAP_SYNC_STATUS.SYNC_PENDING,
        sapCallInProgress: SapCallInProgress.MAINTAIN_QUOTATION_IN_PROGRESS,
        quotationDetailSapSyncStatusList: [
          { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNC_PENDING },
        ],
      };

      service.getSapSyncStatus(gqId).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_SAP_SYNC_STATUS}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
  });

  describe('getCases', () => {
    test('should call', () => {
      service
        .getCases(QuotationTab.ACTIVE, 'userId', QuotationStatus.ACTIVE)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}?${service['PARAM_STATUS']}=${QuotationStatus.ACTIVE}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });

    test('should call with nextApprover', () => {
      service
        .getCases(
          QuotationTab.TO_APPROVE,
          'userId',
          QuotationStatus.IN_APPROVAL
        )
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}?${service['PARAM_STATUS']}=${QuotationStatus.IN_APPROVAL}&${service['PARAM_NEXT_APPROVER']}=userId`
      );
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
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`
      );
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
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`
      );
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
        gpsdGroupIds: ['F02'],
        salesIndications: [SalesIndication.INVOICE],
        historicalDataLimitInYear: 2,
      };
      service.createCustomerCase(mockBody).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_CUSTOMER_QUOTATION}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(mockBody);
    });
  });

  describe('updateQuotation', () => {
    test('should call', () => {
      const updateQuotationRequest: UpdateQuotationRequest = {
        caseName: 'caseName',
        currency: 'EUR',
        quotationToDate: '',
        validTo: '',
        customerPurchaseOrderDate: '',
        requestedDelDate: '',
        shipToParty: {
          customerId: '1234',
          salesOrg: '5678',
        } as ShipToParty,
      };
      const gqId = 12_345;
      service
        .updateQuotation(updateQuotationRequest, gqId)
        .subscribe((response) => {
          expect(response).toEqual([]);
        });
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}`
      );
      expect(req.request.method).toBe(HttpMethod.PUT);
      expect(req.request.body).toBe(updateQuotationRequest);
      req.flush(updateQuotationRequest);
    });
  });

  describe('getCurrencies', () => {
    test('should call', () => {
      service.getCurrencies().subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_CURRENCIES}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('getExchangeRateForCurrency', () => {
    test('should call', () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      service
        .getExchangeRateForCurrency(fromCurrency, toCurrency)
        .subscribe((res) => expect(res).toBeTruthy());

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_CURRENCIES}/${fromCurrency}/exchangeRates/${toCurrency}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('createSapQuotation', () => {
    it('should call', () => {
      const mockBody: { gqId: number; gqPositionIds: string[] } = {
        gqId: 1,
        gqPositionIds: ['12-12-12-12'],
      };
      service
        .createSapQuotation(1, ['12-12-12-12'])
        .subscribe((res) => expect(res).toBeTruthy());
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_SAP_QUOTATION}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(mockBody);
    });
  });

  describe('getPurchaseOrderTypes', () => {
    test('should call the service', () => {
      service
        .getPurchaseOrderTypes()
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PURCHASE_ORDER_TYPES}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });
  describe('getOfferTypes', () => {
    test('should call the service', () => {
      service
        .getOfferTypes()
        .subscribe((res) => expect(res).toEqual({ results: [] }));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.OFFER_TYPES}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });
});
