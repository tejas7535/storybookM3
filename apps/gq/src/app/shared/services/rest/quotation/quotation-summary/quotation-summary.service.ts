import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of } from 'rxjs';

import { CasesCriteriaSelection } from '@gq/shared/components/global-search-bar/cases-result-table/cases-criteria-selection.enum';
import { MaterialsCriteriaSelection } from '@gq/shared/components/global-search-bar/materials-result-table/material-criteria-selection.enum';
import { ApiVersion } from '@gq/shared/models';
import { QuotationSearchResult } from '@gq/shared/models/quotation';
import {
  QuotationSearchByCasesResponse,
  QuotationSearchResultByCases,
} from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import {
  QuotationSearchResultByMaterials,
  QuotationSearchResultByMaterialsResponse,
} from '@gq/shared/models/quotation/quotation-search-result-by-materials.interface';

import { QuotationSummaryPaths } from './quotation-summary-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class QuotationSummaryService {
  private readonly PARAM_MATERIAL_NUMBER = 'material-number';
  private readonly PARAM_USER_CASES_ONLY = 'userCasesOnly';

  private readonly PARAM_USER_QUOTATIONS_ONLY = 'userQuotationsOnly';
  private readonly PARAM_CRITERIA = 'criteria';
  private readonly PARAM_VALUE = 'value';

  readonly #http = inject(HttpClient);

  getCasesByMaterialNumber(
    materialNumber: string,
    userCaseOnly: boolean
  ): Observable<QuotationSearchResult[]> {
    const httpParams = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, materialNumber)
      .append(this.PARAM_USER_CASES_ONLY, userCaseOnly);

    return this.#http.get<QuotationSearchResult[]>(
      `${ApiVersion.V1}/${QuotationSummaryPaths.PATH_QUOTATIONS_SUMMARY}`,
      {
        params: httpParams,
      }
    );
  }

  getSearchResultsByCases(
    userQuotationsOnly: boolean,
    criteria: CasesCriteriaSelection,
    value: string
  ): Observable<QuotationSearchResultByCases[]> {
    const httpParams = new HttpParams()
      .set(this.PARAM_USER_QUOTATIONS_ONLY, userQuotationsOnly)
      .append(this.PARAM_CRITERIA, criteria)
      .append(this.PARAM_VALUE, value);

    return this.#http
      .get<QuotationSearchByCasesResponse>(
        `${ApiVersion.V1}/${QuotationSummaryPaths.PATH_QUOTATIONS_SUMMARY}/${QuotationSummaryPaths.SEARCH_BY_QUOTATIONS}`,
        {
          params: httpParams,
        }
      )
      .pipe(
        catchError(() => of({ results: [] })),
        map((data) => data.results)
      );
  }

  getSearchResultsByMaterials(
    userQuotationsOnly: boolean,
    criteria: MaterialsCriteriaSelection,
    value: string
  ): Observable<QuotationSearchResultByMaterials[]> {
    const httpParams = new HttpParams()
      .set(this.PARAM_USER_QUOTATIONS_ONLY, userQuotationsOnly)
      .append(this.PARAM_CRITERIA, criteria)
      .append(
        this.PARAM_VALUE,
        criteria === MaterialsCriteriaSelection.MATERIAL_NUMBER
          ? value.replaceAll('-', '')
          : value
      );

    return this.#http
      .get<QuotationSearchResultByMaterialsResponse>(
        `${ApiVersion.V1}/${QuotationSummaryPaths.PATH_QUOTATIONS_SUMMARY}/${QuotationSummaryPaths.SEARCH_BY_MATERIALS}`,
        {
          params: httpParams,
        }
      )
      .pipe(
        catchError(() => of({ results: [] })),
        map((data) => data.results)
      );
  }
}
