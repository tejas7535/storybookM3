import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { translate } from '@jsverse/transloco';
import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import {
  ROUTER_NAVIGATED,
  RouterNavigatedAction,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

import { ActiveCaseActions } from '../active-case/active-case.action';
import {
  QuotationStatusByQuotationTab,
  QuotationTab,
} from './models/quotation-tab.enum';
import { OverviewCasesActions } from './overview-cases.actions';
import * as fromOverviewCasesSelector from './overview-cases.selectors';
@Injectable()
export class OverviewCasesEffects implements OnInitEffects {
  /**
   * Load QuotationTab active when navigating to the CaseViewPath
   */
  getCases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: RouterNavigatedAction) => action.payload.routerState),
      filter((routerState: SerializedRouterStateSnapshot) =>
        routerState.url.includes(AppRoutePath.CaseViewPath)
      ),
      concatLatestFrom(() =>
        this.store.select(fromOverviewCasesSelector.getActiveTab)
      ),
      map(([{ params }, activeTab]: [any, QuotationTab]) =>
        OverviewCasesActions.loadCases({
          tab: params?.quotationTab || activeTab || QuotationTab.ACTIVE,
        })
      )
    );
  });

  /**
   * Load QuotationTab when switching between tabs.
   */
  loadCasesForView$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OverviewCasesActions.loadCasesForView),
      concatLatestFrom((action) =>
        this.store.select(
          fromOverviewCasesSelector.getQuotationTabFromView(action.viewId)
        )
      ),
      map(([_action, tab]) => OverviewCasesActions.loadCases({ tab }))
    );
  });

  getCasesCounts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OverviewCasesActions.getCasesCount),
      mergeMap(() => {
        return this.quotationService.getQuotationsCount().pipe(
          map((response) =>
            OverviewCasesActions.getCasesCountSuccess({ response })
          ),
          catchError((errorMessage) =>
            of(OverviewCasesActions.getCasesCountFailure({ errorMessage }))
          )
        );
      })
    );
  });

  /**
   * Get all cases for the authenticated user
   */
  loadCases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OverviewCasesActions.loadCases),
      concatLatestFrom(() => this.store.select(getUserUniqueIdentifier)),
      mergeMap(([action, userId]) => {
        this.location.go(`${AppRoutePath.CaseViewPath}/${action.tab}`);
        const status = QuotationStatusByQuotationTab.get(action.tab);

        return this.quotationService.getCases(action.tab, userId, status).pipe(
          map((response: GetQuotationsResponse) =>
            OverviewCasesActions.loadCasesSuccess({ response })
          ),
          catchError((errorMessage) =>
            of(OverviewCasesActions.loadCasesFailure({ errorMessage }))
          )
        );
      })
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
        this.store.select(fromOverviewCasesSelector.getActiveTab)
      ),
      map(
        ([_, tab]: [
          ReturnType<typeof OverviewCasesActions.updateCasesStatusSuccess>,
          QuotationTab,
        ]) => OverviewCasesActions.loadCases({ tab })
      )
    );
  });
  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly quotationService: QuotationService,
    private readonly snackBar: MatSnackBar,
    private readonly location: Location
  ) {}

  ngrxOnInitEffects(): Action {
    return OverviewCasesActions.getCasesCount();
  }
}
