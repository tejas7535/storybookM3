import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  CaseFilterItem,
  QuotationIdentifier,
  SalesIndication,
} from '@gq/core/store/reducers/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { CUSTOMER_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../../components/autocomplete-input/filter-names.enum';
import { ApiVersion } from '../../../models';
import { AutocompleteSearch } from '../../../models/search';
import { PLsSeriesRequest } from './models/pls-series-request.model';
import { SearchPaths } from './models/search-paths.enum';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let spectator: SpectatorService<SearchService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: SearchService,
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
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('autocomplete', () => {
    test('should call with default limit', () => {
      const search: AutocompleteSearch = new AutocompleteSearch(
        'testparam',
        'hallo'
      );
      const mock: CaseFilterItem = {
        filter: FilterNames.MATERIAL_DESCRIPTION,
        options: [{ id: 'test', value: 'test', selected: false }],
      };
      service.autocomplete(search).subscribe((response) => {
        expect(response).toEqual(mock.options);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SearchPaths.PATH_AUTO_COMPLETE}/testparam?search_for=hallo&limit=100`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(mock);
    });
    test('should call for sapquotation with custom limit', () => {
      const search: AutocompleteSearch = new AutocompleteSearch(
        FilterNames.SAP_QUOTATION,
        'test',
        5
      );
      const mock: CaseFilterItem = {
        filter: FilterNames.MATERIAL_DESCRIPTION,
        options: [{ id: 'test', value: 'test', selected: false }],
      };
      service.autocomplete(search).subscribe((response) => {
        expect(response).toEqual(mock.options);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SearchPaths.PATH_AUTO_COMPLETE}/sap-quotation?search_for=test&limit=5`
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
        `${ApiVersion.V1}/${SearchPaths.PATH_GET_SALES_ORGS}?${service['PARAM_CUSTOMER_ID']}=${customerId}`
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

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SearchPaths.PATH_CUSTOMERS}/1234/0267`
      );
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
        historicalDataLimitInYear: 2,
      };
      service.getPlsAndSeries(requestPayload).subscribe((response) => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SearchPaths.PATH_PLS_AND_SERIES}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
    });
  });
});
