import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { QuotationStatus } from '../../../../shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '../../../../shared/services/rest/quotation/models/get-quotations-response.interface';
import { QuotationService } from '../../../../shared/services/rest/quotation/quotation.service';
import {
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  loadQuotation,
  updateCasesStatusFailure,
  updateCasesStatusSuccess,
  updateCaseStatus,
} from '../../actions';
import { getDisplayStatus } from '../../selectors';

/**
 * Effect class for all view case related actions
 */
@Injectable()
export class ViewCasesEffect {
  /**
   * Load Cases if case view patch
   */
  getCases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState) =>
        routerState.url.includes(AppRoutePath.CaseViewPath)
      ),
      map(() => loadCases({ status: QuotationStatus.ACTIVE }))
    );
  });

  /**
   * Get all cases for the authenticated user
   */
  loadCases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCases),
      mergeMap((action) =>
        this.quotationService.getCases(action.status).pipe(
          map((response: GetQuotationsResponse) =>
            loadCasesSuccess({ response })
          ),
          catchError((errorMessage) => of(loadCasesFailure({ errorMessage })))
        )
      )
    );
  });

  /**
   * After sucessfully changing the status of a quotation, we need to reload it
   * to be up-to-date with the backend data
   */
  reloadQuotationAfterStatusChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCasesSuccess),
      mergeMap(async () => loadQuotation())
    );
  });

  /**
   * Update status of selected case for the authenticated user
   */
  updateCasesStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateCaseStatus),
      mergeMap((action) =>
        this.quotationService.updateCases(action.gqIds, action.status).pipe(
          tap(() => {
            const successMessage = translate(
              `caseView.snackBarMessages.updateStatus.${QuotationStatus[
                action.status
              ].toLowerCase()}`
            );

            this.snackBar.open(successMessage);
          }),
          map(() => updateCasesStatusSuccess({ gqIds: action.gqIds })),
          catchError((errorMessage) =>
            of(updateCasesStatusFailure({ errorMessage }))
          )
        )
      )
    );
  });

  /**
   * After having the status of cases updated, load the cases depending on the view selected
   */
  loadCasesAfterUpdatingStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateCasesStatusSuccess),
      concatLatestFrom(() => this.store.select(getDisplayStatus)),
      map(
        ([_, status]: [
          ReturnType<typeof updateCasesStatusSuccess>,
          QuotationStatus
        ]) => loadCases({ status })
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly quotationService: QuotationService,
    private readonly snackBar: MatSnackBar
  ) {}
}
