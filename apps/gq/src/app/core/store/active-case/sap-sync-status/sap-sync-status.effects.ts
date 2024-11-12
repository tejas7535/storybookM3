import { Injectable } from '@angular/core';

import { from, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  mergeMap,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import {
  getGqId,
  getSapId,
} from '@gq/core/store/active-case/active-case.selectors';
import { SAP_SYNC_STATUS } from '@gq/shared/models';
import { QuotationSapSyncStatusResult } from '@gq/shared/models/quotation/quotation-sap-sync-status-result.model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApprovalActions } from '../../approval/approval.actions';

@Injectable()
export class SapSyncStatusEffects {
  getSapSyncStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getSapSyncStatus),
      concatLatestFrom(() => [
        this.store.select(getGqId),
        this.store.select(getSapId),
      ]),
      concatMap(([_action, gqId, sapId]) =>
        this.quotationService.getSapSyncStatus(gqId).pipe(
          mergeMap((result: QuotationSapSyncStatusResult) => {
            if (result.sapSyncStatus !== SAP_SYNC_STATUS.SYNC_PENDING) {
              return [
                ActiveCaseActions.getSapSyncStatusSuccess({ result }),
                ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted(),
                // if a quote was fully synced, the approval data should be reloaded because net value and gpm might have changed
                ApprovalActions.getApprovalCockpitData({
                  sapId,
                  forceLoad: true,
                  hideLoadingSpinner: true,
                }),
              ];
            }

            return [ActiveCaseActions.getSapSyncStatusSuccess({ result })];
          }),
          catchError((errorMessage) =>
            of(ActiveCaseActions.getSapSyncStatusFailure({ errorMessage }))
          )
        )
      )
    );
  });

  quotationSapSyncStatusInterval$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getSapSyncStatusInInterval),
      switchMap(() =>
        timer(0, 5000).pipe(
          switchMap(() =>
            from([{ type: ActiveCaseActions.getSapSyncStatus.type }])
          ),
          takeUntil(
            this.actions$.pipe(
              ofType(ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted)
            )
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly quotationService: QuotationService
  ) {}
}
