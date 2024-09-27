import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';

import { Quotation } from '@gq/shared/models/quotation';
import { QuotationMetadataService } from '@gq/shared/services/rest/quotation/quotation-metadata/quotation-metadata.service';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getGqId } from '../active-case.selectors';
import { QuotationMetadataActions } from './quotation-metadata.action';

@Injectable()
export class QuotationMetadataEffects {
  updateQuotationMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuotationMetadataActions.updateQuotationMetadata),
      concatLatestFrom(() => this.store.select(getGqId)),
      switchMap(([_action, gqId]) =>
        this.quotationMetadataService
          .updateQuotationMetadata(gqId, _action.quotationMetadata)
          .pipe(
            tap(() => {
              // show success message
              const updatedSuccessfullyMessage =
                this.translocoService.translate(
                  'header.noteModal.snackBarMessages.noteSaved',
                  {},
                  'process-case-view'
                );

              this.snackBar.open(updatedSuccessfullyMessage);
            }),
            mergeMap((quotation: Quotation) => {
              return [
                QuotationMetadataActions.updateQuotationMetadataSuccess({
                  quotation,
                }),
              ];
            }),
            catchError((errorMessage) => {
              // show error message
              const errorMsg = this.translocoService.translate(
                'header.noteModal.snackBarMessages.error',
                {},
                'process-case-view'
              );
              this.snackBar.open(errorMsg);

              return of(
                QuotationMetadataActions.updateQuotationMetadataFailure({
                  errorMessage,
                })
              );
            })
          )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly quotationMetadataService: QuotationMetadataService,
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}
}
