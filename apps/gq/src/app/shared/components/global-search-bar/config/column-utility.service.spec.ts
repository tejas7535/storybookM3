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

  describe('postSortRows', () => {
    test('should move rows with no gqLastUpdated to the end of the array after sorting', () => {
      const nodes = [
        { data: { gqLastUpdated: '2021-01-01' } },
        { data: { gqLastUpdated: '2021-01-02' } },
        { data: { gqLastUpdated: null } },
        { data: { gqLastUpdated: '2021-01-03' } },
      ];
      service.postSortRows({ nodes } as any);
      expect(nodes).toEqual([
        { data: { gqLastUpdated: '2021-01-01' } },
        { data: { gqLastUpdated: '2021-01-02' } },
        { data: { gqLastUpdated: '2021-01-03' } },
        { data: { gqLastUpdated: null } },
      ]);
    });
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

  describe('materialGetter', () => {
    test('should return the materialNumber', () => {
      const params = {
        data: {
          materialNumber15: '123456789012345',
        },
      } as ValueGetterParams;
      service['materialNumberService'].formatStringAsMaterialNumber = jest.fn(
        () => '123456789012345'
      );
      const result = service.materialGetter(params);
      expect(result).toEqual('123456789012345');
    });
  });

  describe('gpiGetter', () => {
    test('should return the gpi', () => {
      const params = {
        data: {
          gpi: 0.1234,
        },
      } as ValueGetterParams;
      const result = service.gpiGetter(params);
      expect(result).toEqual('12.34');
    });
  });

  describe('netValueFormatter', () => {
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
      const result = service.netValueFormatter(params);
      expect(result).toEqual('1,234.00 USD');
    });
  });
});
