import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { RfqDataActions } from './rfq-data.actions';

@Injectable()
export class RfqDataEffects {
  loadRfqData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RfqDataActions.getRfqData),
      concatLatestFrom(() => this.activeCaseFacade.quotationCurrency$),
      mergeMap(([action, currency]) =>
        this.quotationDetailsService
          .getRfqData(action.sapId, action.quotationItemId, currency)
          .pipe(
            map((rfqData) =>
              RfqDataActions.getRfqDataSuccess({
                item: rfqData,
              })
            ),
            catchError((errorMessage) =>
              of(RfqDataActions.getRfqDataFailure({ errorMessage }))
            )
          )
      )
    );
  });

  triggerLoadRfqData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ActiveCaseActions.setSelectedQuotationDetail,
        ActiveCaseActions.getQuotationSuccess
      ),
      concatLatestFrom(() => [
        this.activeCaseFacade.selectedQuotationDetail$,
        this.activeCaseFacade.quotationSapId$,
      ]),
      map(([_action, quotationDetail, sapId]) => {
        // when rfqData is present fetch data from backend otherwise reset the state
        return quotationDetail?.rfqData
          ? RfqDataActions.getRfqData({
              sapId,
              quotationItemId: quotationDetail.quotationItemId,
            })
          : RfqDataActions.resetRfqData();
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quotationDetailsService: QuotationDetailsService,
    private readonly activeCaseFacade: ActiveCaseFacade
  ) {}
}
