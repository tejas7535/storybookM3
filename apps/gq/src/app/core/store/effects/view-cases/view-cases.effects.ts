import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';
import { QuotationService } from '../../../../shared/services/rest-services/quotation-service/quotation.service';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
} from '../../actions';

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
      map(loadCases)
    );
  });

  /**
   * Get all cases for the authenticated user
   */
  loadCases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCases.type, deleteCasesSuccess.type),
      mergeMap(() =>
        this.quotationService.getCases().pipe(
          map((quotations: ViewQuotation[]) =>
            loadCasesSuccess({ quotations })
          ),
          catchError((errorMessage) => of(loadCasesFailure({ errorMessage })))
        )
      )
    );
  });

  /**
   * Delete selected case for the authenticated user
   */
  deleteCase$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteCase.type),
      mergeMap((action: any) =>
        this.quotationService.deleteCases(action.gqIds).pipe(
          tap(() => {
            const successMessage = translate(
              'caseView.snackBarMessages.deleteSuccess'
            );
            this.snackBar.open(successMessage);
          }),
          map(deleteCasesSuccess),
          catchError((errorMessage) => of(deleteCasesFailure({ errorMessage })))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quotationService: QuotationService,
    private readonly snackBar: MatSnackBar
  ) {}
}
