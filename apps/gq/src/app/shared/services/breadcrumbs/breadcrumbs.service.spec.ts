import {
  DetailViewQueryParams,
  ProcessCaseViewQueryParams,
} from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AppRoutePath } from '../../../app-route-path.enum';
import { Customer } from '../../models/customer';
import { BreadcrumbsService } from './breadcrumbs.service';

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;
  let spectator: SpectatorService<BreadcrumbsService>;
  const customer = {
    name: 'customer',
  } as Customer;

  const createService = createServiceFactory({
    service: BreadcrumbsService,
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCaseViewBreadcrumb', () => {
    test('should return caseViewBreadcrumb', () => {
      const result = service.getCaseViewBreadcrumb();

      expect(result).toEqual({
        label: 'translate it',
        url: `/${AppRoutePath.CaseViewPath}`,
      });
    });
  });

  describe('getQuotationBreadcrumbs', () => {
    test('should return QuotationBreadcrumbs', () => {
      const queryParams: ProcessCaseViewQueryParams = {
        customer_number: '825663',
        quotation_number: 123,
        sales_org: '0267',
      };
      service.getCaseViewBreadcrumb = jest.fn().mockReturnValue({});
      const result = service['getQuotationBreadcrumbs'](queryParams);

      expect(result).toEqual([
        {},
        {
          queryParams,
          label: `GQ${queryParams.quotation_number}`,
          url: `/${AppRoutePath.ProcessCaseViewPath}`,
        },
      ]);
    });
  });
  describe('getQuotationBreadcrumbsForProcessCaseView', () => {
    test('should return quotationBreadcrumb without url', () => {
      service.getCaseViewBreadcrumb = jest.fn().mockReturnValue({});

      const result = service.getQuotationBreadcrumbsForProcessCaseView(1);

      expect(result).toEqual([{}, { label: `GQ1` }]);
    });
  });

  describe('getDetailViewBreadcrumbs', () => {
    test('should return breadcrumbs with url', () => {
      const queryParams: DetailViewQueryParams = {
        customer_number: '825663',
        quotation_number: 123,
        sales_org: '0267',
        gqPositionId: '123',
      };
      service['getQuotationBreadcrumbs'] = jest.fn().mockReturnValue([{}]);

      const result = service.getDetailViewBreadcrumbs(10, queryParams, true);

      expect(result).toEqual([
        {},
        {
          queryParams,
          label: `translate it ${10}`,
          url: `/${AppRoutePath.DetailViewPath}`,
        },
      ]);
    });
    test('should return breadcrumbs without url', () => {
      const queryParams: DetailViewQueryParams = {
        customer_number: '825663',
        quotation_number: 123,
        sales_org: '0267',
        gqPositionId: '123',
      };
      service['getQuotationBreadcrumbs'] = jest.fn().mockReturnValue([{}]);

      const result = service.getDetailViewBreadcrumbs(10, queryParams, false);

      expect(result).toEqual([
        {},
        {
          label: `translate it ${10}`,
        },
      ]);
    });
  });

  describe('getPriceDetailBreadcrumbs', () => {
    let queryParams: DetailViewQueryParams;
    beforeEach(() => {
      queryParams = {
        customer_number: '825663',
        quotation_number: 123,
        sales_org: '0267',
        gqPositionId: '123',
      };
      service.getDetailViewBreadcrumbs = jest.fn().mockReturnValue([{}]);
    });
    test('should return priceDetailBreadcrumbs breadcrumbs for transactionView', () => {
      const result = service.getPriceDetailBreadcrumbs(10, queryParams, true);

      expect(result).toEqual([{}, { label: 'translate it' }]);
      expect(translate).toHaveBeenCalledWith(
        `shared.breadcrumbs.transactionView`
      );
    });
    test('should return priceDetailBreadcrumbs breadcrumbs for sapView', () => {
      const result = service.getPriceDetailBreadcrumbs(10, queryParams, false);

      expect(result).toEqual([{}, { label: 'translate it' }]);
      expect(translate).toHaveBeenCalledWith(`shared.breadcrumbs.sapView`);
    });
  });

  describe('getCustomerBreadCrumbs', () => {
    test('should return customerBreadcrumbs for detail view', () => {
      const queryParams: DetailViewQueryParams = {
        customer_number: '825663',
        quotation_number: 123,
        sales_org: '0267',
        gqPositionId: '123',
      };
      service.getDetailViewBreadcrumbs = jest.fn().mockReturnValue([{}]);

      const result = service.getCustomerBreadCrumbs(queryParams, customer, 10);

      expect(result).toEqual([{}, { label: 'customer' }]);
    });
    test('should return customerBreadcrumbs for processCaseView', () => {
      const queryParams: DetailViewQueryParams = {
        customer_number: '825663',
        quotation_number: 123,
        sales_org: '0267',
        gqPositionId: undefined,
      };
      service['getQuotationBreadcrumbs'] = jest.fn().mockReturnValue([{}]);

      const result = service.getCustomerBreadCrumbs(queryParams, customer);

      expect(result).toEqual([{}, { label: 'customer' }]);
    });
  });
});
