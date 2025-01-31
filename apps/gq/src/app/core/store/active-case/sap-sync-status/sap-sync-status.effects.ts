import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  expand,
  mergeMap,
  takeWhile,
} from 'rxjs/operators';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { getGqId } from '@gq/core/store/active-case/active-case.selectors';
import { SAP_SYNC_STATUS } from '@gq/shared/models';
import { QuotationSapSyncStatusResult } from '@gq/shared/models/quotation/quotation-sap-sync-status-result.model';
import { QuotationDetailSapSyncStatus } from '@gq/shared/models/quotation-detail/quotation-detail-sap-sync-status.model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { translate } from '@jsverse/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { activeCaseFeature } from '../active-case.reducer';

@Injectable()
export class SapSyncStatusEffects {
  getSapSyncStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getSapSyncStatusInInterval),
      concatLatestFrom(() => [
        this.store.select(getGqId),
        this.store.select(activeCaseFeature.selectDetailsSyncingToSap),
      ]),
      concatMap(([_action, gqId, detailIdsSyncingToSap]) =>
        this.quotationService.getSapSyncStatus(gqId).pipe(
          expand((result) => {
            return result.sapSyncStatus === SAP_SYNC_STATUS.SYNC_PENDING
              ? this.quotationService.getSapSyncStatus(gqId).pipe(delay(5000))
              : of(); // stop expanding further (complete)
          }),
          takeWhile(
            (result) => result.sapSyncStatus === SAP_SYNC_STATUS.SYNC_PENDING,
            true
          ),
          mergeMap((result: QuotationSapSyncStatusResult) => {
            if (result.sapSyncStatus === SAP_SYNC_STATUS.SYNC_PENDING) {
              return [ActiveCaseActions.getSapSyncStatusSuccess({ result })];
            }
            this.showUploadSelectionToast(result, detailIdsSyncingToSap);

            return [
              ActiveCaseActions.getSapSyncStatusSuccess({ result }),
              ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted({
                result,
              }),
            ];
          }),
          catchError((errorMessage) =>
            of(ActiveCaseActions.getSapSyncStatusFailure({ errorMessage }))
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

  private showUploadSelectionToast(
    syncResult: QuotationSapSyncStatusResult,
    detailIdsSyncingToSap: string[]
  ): void {
    const updatedDetails = syncResult.quotationDetailSapSyncStatusList.filter(
      (detail) => detailIdsSyncingToSap.includes(detail.gqPositionId)
    );

    const translateKey =
      // if information of updated details is available, show toast based on that, otherwise show toast based on quotation status
      updatedDetails.length > 0
        ? this.getTranslateKeyByUpdatedDetails(updatedDetails)
        : this.getTranslateKeyByQuotationStatus(syncResult.sapSyncStatus);

    const toastMessage = translate(
      `shared.snackBarMessages.uploadToSapSync.${translateKey}`
    );

    this.snackBar.open(toastMessage);
  }
  private getTranslateKeyByQuotationStatus(
    sapSyncStatus: SAP_SYNC_STATUS
  ): string {
    switch (sapSyncStatus) {
      case SAP_SYNC_STATUS.SYNCED: {
        return 'full';
      }
      case SAP_SYNC_STATUS.SYNC_FAILED: {
        return 'failed';
      }
      default: {
        return 'partially';
      }
    }
  }

  private getTranslateKeyByUpdatedDetails(
    updatedDetails: QuotationDetailSapSyncStatus[]
  ): string {
    if (
      updatedDetails.every((d) => d.sapSyncStatus === SAP_SYNC_STATUS.SYNCED)
    ) {
      return 'full';
    } else if (
      updatedDetails.every(
        (d) => d.sapSyncStatus === SAP_SYNC_STATUS.SYNC_FAILED
      )
    ) {
      return 'failed';
    } else {
      return 'partially';
    }
  }
}
