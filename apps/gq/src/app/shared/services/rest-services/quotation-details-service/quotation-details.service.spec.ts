import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
} from '../../../../../testing/mocks';
import { UpdateQuotationDetail } from '../../../../core/store/reducers/process-case/models';
import { AddQuotationDetailsRequest } from '../../../../core/store/reducers/process-case/models/add-quotation-details-request.model';
import { QuotationDetailsService } from './quotation-details.service';

describe('QuotationDetailsService', (): void => {
  let service: QuotationDetailsService;
  let spectator: SpectatorService<QuotationDetailsService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: QuotationDetailsService,
    imports: [HttpClientTestingModule],
    providers: [
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
      service.addMaterial(tableData).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne(`/${service['PATH_QUOTATION_DETAILS']}`);
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
      service.removeMaterial(qgPositionIds).subscribe((response) => {
        expect(response).toEqual(mock.quotationDetails);
      });

      const req = httpMock.expectOne(`/${service['PATH_QUOTATION_DETAILS']}`);
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

      service.updateMaterial(quotationDetails).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne(`/${service['PATH_QUOTATION_DETAILS']}`);
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
        `/${service['PATH_QUOTATION_DETAILS']}/${gqPositionId}/${service['PATH_TRANSACTIONS']}`
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
        `/${service['PATH_QUOTATIONS']}/${quotationNumber}/${service['PATH_TRANSACTIONS']}`
      );
      req.flush(quotationNumber);

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('getMaterialAlternativeCosts', () => {
    test('should fetch Material Alternative Costs', () => {
      const gqPositionId = '1234';
      service
        .getMaterialAlternativeCosts(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `/${service['PATH_QUOTATION_DETAILS']}/${gqPositionId}/${service['PATH_MATERIAL_ALTERNATIVE_COSTS']}`
      );
      req.flush(gqPositionId);

      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });
});
