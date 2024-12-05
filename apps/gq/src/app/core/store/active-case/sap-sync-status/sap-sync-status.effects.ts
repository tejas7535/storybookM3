import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { from, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  mergeMap,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { getGqId } from '@gq/core/store/active-case/active-case.selectors';
import { SAP_SYNC_STATUS } from '@gq/shared/models';
import { QuotationSapSyncStatusResult } from '@gq/shared/models/quotation/quotation-sap-sync-status-result.model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { translate } from '@jsverse/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class SapSyncStatusEffects {
  getSapSyncStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getSapSyncStatus),
      concatLatestFrom(() => [this.store.select(getGqId)]),
      concatMap(([_action, gqId]) =>
        this.quotationService.getSapSyncStatus(gqId).pipe(
          mergeMap((result: QuotationSapSyncStatusResult) => {
            if (result.sapSyncStatus !== SAP_SYNC_STATUS.SYNC_PENDING) {
              this.showUploadSelectionToast(result.sapSyncStatus);

              return [
                ActiveCaseActions.getSapSyncStatusSuccess({ result }),
                ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted({
                  result,
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
          concatMap(() =>
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
    private readonly quotationService: QuotationService,
    private readonly snackBar: MatSnackBar
  ) {}

  private showUploadSelectionToast(sapSyncStatus: SAP_SYNC_STATUS): void {
    let translateKey = 'failed';

    if (sapSyncStatus === SAP_SYNC_STATUS.SYNCED) {
      translateKey = 'full';
    } else if (sapSyncStatus === SAP_SYNC_STATUS.PARTIALLY_SYNCED) {
      translateKey = 'partially';
    }

    const toastMessage = translate(
      `shared.snackBarMessages.uploadToSapSync.${translateKey}`
    );

    this.snackBar.open(toastMessage);
  }
}
