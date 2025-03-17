import { HttpClient, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { withCache } from '@ngneat/cashew';

import { QuotationKpiRequest } from './model/quotation-kpi-request.interface';

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  private readonly PATH_CALCULATION = 'calculation';
  private readonly PATH_QUOTATION_DETAILS_KPI = 'quotation-details-kpi';

  private readonly http: HttpClient = inject(HttpClient);

  public getQuotationKpiCalculation(
    requestBody: QuotationKpiRequest
  ): Observable<QuotationDetailsSummaryKpi> {
    return this.http.post<QuotationDetailsSummaryKpi>(
      `${ApiVersion.V1}/${this.PATH_CALCULATION}/${this.PATH_QUOTATION_DETAILS_KPI}`,
      requestBody,
      {
        context: withCache({
          clearCachePredicate: (previousRequest, currentRequest) =>
            this.requestHasChanged(previousRequest, currentRequest),
        }),
      }
    );
  }
  requestHasChanged<T>(
    previousRequest: HttpRequest<T>,
    currentRequest: HttpRequest<T>
  ): boolean {
    return (
      !previousRequest ||
      JSON.stringify(previousRequest.body) !==
        JSON.stringify(currentRequest.body)
    );
  }
}
