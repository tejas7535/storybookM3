import { inject, Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { RouterStateUrl } from '@gq/core/store/reducers';
import { QuotationDetail } from '@gq/shared/models';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { QuotationDetailKpi } from '@gq/shared/services/rest/calculation/model/quotation-detail-kpi.interface';
import { QuotationKpiRequest } from '@gq/shared/services/rest/calculation/model/quotation-kpi-request.interface';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { SelectedQuotationDetailsKpiActions } from './selected-quotation-details-kpi.actions';

@Injectable()
export class SelectedQuotationDetailsKpiEffects {
  private readonly actions = inject(Actions);
  private readonly calculationService = inject(CalculationService);

  getSelectedQuotationDetailKpi$ = createEffect(() => {
    return this.actions.pipe(
      ofType(SelectedQuotationDetailsKpiActions.loadKPI),
      mergeMap(({ data }) => {
        if (data.length === 0) {
          return of(SelectedQuotationDetailsKpiActions.resetKPI());
        }

        const request = this.quotationDetailsToRequestData(data);

        return this.calculationService.getQuotationKpiCalculation(request).pipe(
          map((response) =>
            SelectedQuotationDetailsKpiActions.loadKPISuccess({
              response,
            })
          ),
          catchError((error) =>
            of(
              SelectedQuotationDetailsKpiActions.loadKPIFailure({
                error,
              })
            )
          )
        );
      })
    );
  });

  // ensure the store has a clean state when opening a quotation
  resetSelectedQuotationDetailKpi$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.includes(`${AppRoutePath.ProcessCaseViewPath}`)
      ),
      map(() => SelectedQuotationDetailsKpiActions.resetKPI())
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
          gqRating,
        } = qd;
        const kpi: QuotationDetailKpi = {
          netValue,
          gpi,
          gpm,
          priceDiff,
          gqRating,
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
