import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { ActiveCaseActions } from '../active-case';
import { ActiveCaseFacade } from '../active-case/active-case.facade';
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
      filter(() => this.featureToggleService.isEnabled('refreshRfqData')),
      concatLatestFrom(() => [
        this.activeCaseFacade.selectedQuotationDetail$,
        this.activeCaseFacade.quotationSapId$,
      ]),
      filter(
        ([_action, quotationDetail, _sapId]) =>
          quotationDetail?.rfqData !== null
      ),
      map(([_action, quotationDetail, sapId]) =>
        RfqDataActions.getRfqData({
          sapId,
          quotationItemId: quotationDetail.quotationItemId,
        })
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quotationDetailsService: QuotationDetailsService,
    private readonly activeCaseFacade: ActiveCaseFacade,
    private readonly featureToggleService: FeatureToggleConfigService
  ) {}
}
