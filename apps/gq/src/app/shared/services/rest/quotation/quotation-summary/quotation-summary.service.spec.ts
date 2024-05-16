import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CasesCriteriaSelection } from '@gq/shared/components/global-search-bar/cases-result-table/cases-criteria-selection.enum';
import { ApiVersion, QuotationStatus } from '@gq/shared/models';
import { QuotationSearchByCasesResponse } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { QuotationSummaryService } from './quotation-summary.service';
import { QuotationSummaryPaths } from './quotation-summary-paths.enum';

describe('QuotationService', () => {
  let service: QuotationSummaryService;
  let spectator: SpectatorService<QuotationSummaryService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: QuotationSummaryService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCasesByMaterialNumber', () => {
    test('should call the service', () => {
      service
        .getCasesByMaterialNumber('123456', true)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationSummaryPaths.PATH_QUOTATIONS_SUMMARY}/${QuotationSummaryPaths.SEARCH_BY_MATERIALS}?${service['PARAM_MATERIAL_NUMBER']}=123456&${service['PARAM_USER_CASES_ONLY']}=true`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('getSearchResultsByCases', () => {
    test('should call the service', () => {
      service
        .getSearchResultsByCases(false, CasesCriteriaSelection.GQ_ID, 'value')
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationSummaryPaths.PATH_QUOTATIONS_SUMMARY}/${QuotationSummaryPaths.SEARCH_BY_QUOTATIONS}?${service['PARAM_USER_QUOTATIONS_ONLY']}=false&${service['PARAM_CRITERIA']}=${CasesCriteriaSelection.GQ_ID}&${service['PARAM_VALUE']}=value`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });

    test('should map the results', () => {
      const response = {
        results: [
          {
            gqId: 1,
            status: QuotationStatus.ACTIVE,
          },
        ],
      } as QuotationSearchByCasesResponse;

      service
        .getSearchResultsByCases(
          false,
          CasesCriteriaSelection.CUSTOMER_ID,
          'value'
        )
        .subscribe((data) => {
          expect(data).toEqual(response.results);
        });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationSummaryPaths.PATH_QUOTATIONS_SUMMARY}/${QuotationSummaryPaths.SEARCH_BY_QUOTATIONS}?${service['PARAM_USER_QUOTATIONS_ONLY']}=false&${service['PARAM_CRITERIA']}=${CasesCriteriaSelection.CUSTOMER_ID}&${service['PARAM_VALUE']}=value`
      );

      req.flush(response);
    });
  });
});
