import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  AddQuotationDetailsRequest,
  UpdateQuotationDetail,
} from '@gq/core/store/active-case/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
} from '../../../../../testing/mocks';
import { ApiVersion } from '../../../models';
import { QuotationDetailsService } from './quotation-details.service';

describe('QuotationDetailsService', (): void => {
  let service: QuotationDetailsService;
  let spectator: SpectatorService<QuotationDetailsService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: QuotationDetailsService,
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

  test('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('addMaterial', () => {
    test('should call', () => {
      const tableData: AddQuotationDetailsRequest = {
        gqId: 12_345,
        items: [
          {
            materialId: '123456',
            quantity: 100,
            quotationItemId: 10,
          },
        ],
      };
      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.addQuotationDetails(tableData).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}`
      );
      req.flush(mock);

      expect(req.request.method).toBe(HttpMethod.POST);
    });
  });
  describe('removeMaterial', () => {
    test('should call', () => {
      const qgPositionIds = ['123456'];

      const mock = {
        quotationDetails: [CUSTOMER_MOCK],
      };
      service.deleteQuotationDetail(qgPositionIds).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}`
      );
      req.flush(mock);

      expect(req.request.method).toBe(HttpMethod.DELETE);
    });
  });

  describe('updateMaterial', () => {
    test('should call', () => {
      const quotationDetails: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 20,
        },
      ];

      service.updateQuotationDetail(quotationDetails).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}`
      );
      req.flush(quotationDetails);

      expect(req.request.method).toBe(HttpMethod.PUT);
    });
  });
  describe('get Transactions', () => {
    test('with limit should call', () => {
      const gqPositionId = '1234';
      service
        .getTransactions(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}/${gqPositionId}/${service['PATH_TRANSACTIONS']}`
      );
      req.flush(gqPositionId);

      expect(req.request.method).toBe(HttpMethod.GET);
    });

    test('with no limit should call', () => {
      const quotationNumber = 410;
      service
        .getAllTransactions(quotationNumber)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATIONS']}/${quotationNumber}/${service['PATH_TRANSACTIONS']}`
      );
      req.flush(quotationNumber);

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('getMaterialComparableCosts', () => {
    test('should fetch Material Comparable Costs', () => {
      const gqPositionId = '1234';
      service
        .getMaterialComparableCosts(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}/${gqPositionId}/${service['PATH_MATERIAL_COMPARABLE_COSTS']}`
      );
      req.flush(gqPositionId);

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('get Material Status', () => {
    test('should fetch Material Status', () => {
      const gqPositionId = '1234';
      service
        .getMaterialStatus(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}/${gqPositionId}/${service['PATH_MATERIAL_STATUS']}`
      );
      req.flush(gqPositionId);

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('get SapPriceDetails', () => {
    test('should call', () => {
      const gqPositionId = '1234';
      service
        .getSapPriceDetails(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}/${gqPositionId}/${service['PATH_SAP_PRICE_DETAILS']}`
      );
      req.flush(gqPositionId);

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('getRfqData', () => {
    test('should call', () => {
      const sapId = '1234';
      const quotationItemId = 1234;
      const currency = 'EUR';
      service
        .getRfqData(sapId, quotationItemId, currency)
        .subscribe((res) => expect(res).toEqual([]));
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}/${service['PATH_RFQ_DATA']}?sap-id=1234&quotation-item-id=1234&currency=EUR`
      );
      req.flush(sapId);
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('updateCostData', () => {
    test('should call', () => {
      const gqPositionId = '1234';
      service
        .updateCostData(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_QUOTATION_DETAILS']}/${gqPositionId}/${service['PATH_UPDATE_COST_DATA']}`
      );
      req.flush(gqPositionId);

      expect(req.request.method).toBe(HttpMethod.PUT);
    });
  });
});
