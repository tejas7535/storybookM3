/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { SharedQuotationActions } from '@gq/core/store/shared-quotation/shared-quotation.actions';
import { SharedQuotation } from '@gq/shared/models';
import { SharedQuotationService } from '@gq/shared/services/rest/shared-quotation/shared-quotation.service';
import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class SharedQuotationEffects {
  readonly #actions$ = inject(Actions);
  readonly #snackBar = inject(MatSnackBar);
  readonly #sharedQuotationService = inject(SharedQuotationService);

  getSharedQuotation$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(SharedQuotationActions.getSharedQuotation),
      concatMap(
        (
          action: ReturnType<typeof SharedQuotationActions.getSharedQuotation>
        ) =>
          this.#sharedQuotationService.getSharedQuotation(action.gqId).pipe(
            map((result: SharedQuotation) =>
              SharedQuotationActions.getSharedQuotationSuccess({
                sharedQuotation: result,
              })
            ),
            catchError((errorMessage) =>
              of(
                SharedQuotationActions.getSharedQuotationFailure({
                  errorMessage,
                })
              )
            )
          )
      )
    );
  });

  saveSharedQuotation$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(SharedQuotationActions.saveSharedQuotation),
      concatMap(
        (
          action: ReturnType<typeof SharedQuotationActions.saveSharedQuotation>
        ) =>
          this.#sharedQuotationService.saveSharedQuotation(action.gqId).pipe(
            tap(() => {
              const successMessage = translate(
                'shared.snackBarMessages.sharedQuotationSaved'
              );
              this.#snackBar.open(successMessage);
            }),
            map((result: SharedQuotation) =>
              SharedQuotationActions.saveSharedQuotationSuccess({
                sharedQuotation: result,
              })
            ),
            catchError((errorMessage) =>
              of(
                SharedQuotationActions.saveSharedQuotationFailure({
                  errorMessage,
                })
              )
            )
          )
      )
    );
  });

  deleteSharedQuotation$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(SharedQuotationActions.deleteSharedQuotation),
      concatMap(
        (
          action: ReturnType<
            typeof SharedQuotationActions.deleteSharedQuotation
          >
        ) =>
          this.#sharedQuotationService.deleteSharedQuotation(action.id).pipe(
            tap(() => {
              const successMessage = translate(
                'shared.snackBarMessages.sharedQuotationUnsaved'
              );
              this.#snackBar.open(successMessage);
            }),
            map(() => SharedQuotationActions.deleteSharedQuotationSuccess()),
            catchError((errorMessage) =>
              of(
                SharedQuotationActions.deleteSharedQuotationFailure({
                  errorMessage,
                })
              )
            )
          )
      )
    );
  });
}
