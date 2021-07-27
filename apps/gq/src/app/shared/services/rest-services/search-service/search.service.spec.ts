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

import { CUSTOMER_MOCK } from '../../../../../testing/mocks';
import { CaseFilterItem } from '../../../../core/store/reducers/create-case/models';
import { QuotationIdentifier } from '../../../../core/store/reducers/process-case/models';
import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { FilterNames } from '../../../autocomplete-input/filter-names.enum';
import { AutocompleteSearch } from '../../../models/search';
import { PLsSeriesRequest } from './models/pls-series-request.model';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let spectator: SpectatorService<SearchService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: SearchService,
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
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('autocomplete', () => {
    test('should call', () => {
      const search: AutocompleteSearch = new AutocompleteSearch(
        'testParam',
        'hallo'
      );
      const mock: CaseFilterItem = {
        filter: 'house',
        options: [{ id: 'test', value: 'test', selected: false }],
      };
      service.autocomplete(search).subscribe((response) => {
        expect(response).toEqual(mock.options);
      });

      const req = httpMock.expectOne(
        `/${service['PATH_AUTO_COMPLETE']}/testparam?search_for=hallo`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
    test('should call for sapquotation', () => {
      const search: AutocompleteSearch = new AutocompleteSearch(
        FilterNames.SAP_QUOTATION,
        'test'
      );
      const mock: CaseFilterItem = {
        filter: 'house',
        options: [{ id: 'test', value: 'test', selected: false }],
      };
      service.autocomplete(search).subscribe((response) => {
        expect(response).toEqual(mock.options);
      });

      const req = httpMock.expectOne(
        `/${service['PATH_AUTO_COMPLETE']}/sap-quotation?search_for=test`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
  });

  describe('getSalesOrgs', () => {
    test('should call', () => {
      const customerId = '123456';
      service.getSalesOrgs(customerId).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(
        `/${service['PATH_GET_SALES_ORGS']}?${service['PARAM_CUSTOMER_ID']}=${customerId}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(customerId);
    });
  });
  describe('getCustomer', () => {
    test('should call', () => {
      const quotationIdentifier: QuotationIdentifier = {
        customerNumber: '1234',
        gqId: 1_147_852,
        salesOrg: '0267',
      };
      const mock = {
        customerDetails: CUSTOMER_MOCK,
      };
      service.getCustomer(quotationIdentifier).subscribe((response) => {
        expect(response).toEqual(mock.customerDetails);
      });

      const req = httpMock.expectOne(`/${service['PATH_CUSTOMERS']}/1234/0267`);
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
  });

  describe('getPlsAndSeries', () => {
    test('should call', () => {
      const requestPayload: PLsSeriesRequest = {
        customer: CUSTOMER_MOCK.identifier,
        includeQuotationHistory: true,
        salesIndications: [SalesIndication.INVOICE],
      };
      service.getPlsAndSeries(requestPayload).subscribe((response) => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`/${service['PATH_PLS_AND_SERIES']}`);
      expect(req.request.method).toBe(HttpMethod.POST);
    });
  });
});
