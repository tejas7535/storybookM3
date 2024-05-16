import { Keyboard, QuotationStatus } from '@gq/shared/models';
import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';

import { ColumnUtilityService } from './column-utility.service';

describe('ColumnUtilityService', () => {
  let service: ColumnUtilityService;
  let spectator: SpectatorService<ColumnUtilityService>;

  const createService = createServiceFactory({
    service: ColumnUtilityService,
    providers: [
      MockProvider(TransformationService, {
        transformNumberCurrency: jest.fn(),
      }),
    ],
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('createdByGetter', () => {
    test('should return createdBy', () => {
      const data = {
        gqCreatedByUser: {
          name: 'name',
          id: 'id',
        },
      } as QuotationSearchResultByCases;
      const result = service.createdByGetter(data);
      expect(result).toEqual('name (id)');
    });
    test('should return dash', () => {
      const data = {
        gqCreatedByUser: {
          name: null,
          id: null,
        },
      } as QuotationSearchResultByCases;
      const result = service.createdByGetter(data);
      expect(result).toEqual(Keyboard.DASH);
    });
  });

  describe('viewQuotationGetter', () => {
    test('should return the viewQuotationObject', () => {
      const params = {
        data: {
          gqId: '1234',
          customerId: '45',
          salesOrg: '0215',
          status: QuotationStatus.ACTIVE,
          enabledForApprovalWorkflow: false,
        },
      } as ValueGetterParams;
      const result = service.viewQuotationGetter(params);
      expect(result).toEqual({
        customerIdentifiers: {
          customerId: '45',
          salesOrg: '0215',
        },
        quotationStatus: QuotationStatus.ACTIVE,
        enabledForApprovalWorkflow: false,
      });
    });
  });

  describe('totalNetValueFormatter', () => {
    test('should return the totalNetValue', () => {
      const params = {
        value: 1234,
        data: {
          currency: 'USD',
        },
      } as ValueFormatterParams;
      service['transformationService'].transformNumberCurrency = jest.fn(
        () => '1,234.00 USD'
      );
      const result = service.totalNetValueFormatter(params);
      expect(result).toEqual('1,234.00 USD');
    });
  });
});
