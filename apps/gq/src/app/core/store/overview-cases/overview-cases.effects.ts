import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { ActiveCaseActions } from '../active-case/active-case.action';
import { OverviewCasesActions } from './overview-cases.actions';
import * as fromOverviewCasesSelector from './overview-cases.selectors';

@Injectable()
export class OverviewCasesEffects {
  getCases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState) =>
        routerState.url.includes(AppRoutePath.CaseViewPath)
      ),
      map(() =>
        OverviewCasesActions.loadCases({ status: QuotationStatus.ACTIVE })
      )
    );
  });

  loadCasesForView$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OverviewCasesActions.loadCasesForView),
      concatLatestFrom((action) =>
        this.store.select(
          fromOverviewCasesSelector.getQuotationStatusFromView(action.viewId)
        )
      ),
      map(([_action, status]) => OverviewCasesActions.loadCases({ status }))
    );
  });

  /**
   * Get all cases for the authenticated user
   */
  loadCases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OverviewCasesActions.loadCases),
      mergeMap((action) =>
        this.quotationService.getCases(action.status).pipe(
          map((response: GetQuotationsResponse) =>
            OverviewCasesActions.loadCasesSuccess({ response })
          ),
          catchError((errorMessage) =>
            of(OverviewCasesActions.loadCasesFailure({ errorMessage }))
          )
        )
      )
    );
  });

  /**
   * Update status of selected case for the authenticated user
   */
  updateCasesStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OverviewCasesActions.updateCasesStatus),
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
          mergeMap(() => [
            ActiveCaseActions.clearActiveQuotation(), // cleared active quotation enforces a reload when opening a quotation which ensures to get eventual changes
            OverviewCasesActions.updateCasesStatusSuccess({
              gqIds: action.gqIds,
            }),
          ]),
          catchError((errorMessage) =>
            of(OverviewCasesActions.updateCasesStatusFailure({ errorMessage }))
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
      ofType(OverviewCasesActions.updateCasesStatusSuccess),
      concatLatestFrom(() =>
        this.store.select(fromOverviewCasesSelector.getDisplayStatus)
      ),
      map(
        ([_, status]: [
          ReturnType<typeof OverviewCasesActions.updateCasesStatusSuccess>,
          QuotationStatus
        ]) => OverviewCasesActions.loadCases({ status })
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
