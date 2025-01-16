import { inject, Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { QuotationDetail } from '@gq/shared/models';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { QuotationDetailKpi } from '@gq/shared/services/rest/calculation/model/quotation-detail-kpi.interface';
import { QuotationKpiRequest } from '@gq/shared/services/rest/calculation/model/quotation-kpi-request.interface';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { SelectedQuotationDetailsKpiActions } from './selected-quotation-details-kpi.actions';

@Injectable()
export class SelectedQuotationDetailsKpiEffects {
  private readonly actions = inject(Actions);
  private readonly calculationService = inject(CalculationService);

  getQuotationKpi$ = createEffect(() => {
    return this.actions.pipe(
      ofType(SelectedQuotationDetailsKpiActions.loadQuotationKPI),
      mergeMap(({ data }) => {
        if (data.length === 0) {
          return of(SelectedQuotationDetailsKpiActions.resetQuotationKPI());
        }

        const request = this.quotationDetailsToRequestData(data);

        return this.calculationService.getQuotationKpiCalculation(request).pipe(
          map((response) =>
            SelectedQuotationDetailsKpiActions.loadQuotationKPISuccess({
              response,
            })
          ),
          catchError((error) =>
            of(
              SelectedQuotationDetailsKpiActions.loadQuotationKPIFailure({
                error,
              })
            )
          )
        );
      })
    );
  });

  quotationDetailsToRequestData(
    quotationDetails: QuotationDetail[]
  ): QuotationKpiRequest {
    const detailKpiList: QuotationDetailKpi[] = quotationDetails.map(
      (qd): QuotationDetailKpi => {
        const {
          gpi,
          gpm,
          priceDiff,
          orderQuantity,
          material,
          rfqData,
          netValue,
        } = qd;
        const kpi: QuotationDetailKpi = {
          netValue,
          gpi,
          gpm,
          priceDiff,
          quantity: orderQuantity,
          materialNumber15: material.materialNumber15,
          rfqDataGpm: rfqData?.gpm,
        };

        return kpi;
      }
    );

    return { detailKpiList };
  }
}
