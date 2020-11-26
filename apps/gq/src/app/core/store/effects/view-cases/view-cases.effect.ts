import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ViewCasesService } from '../../../../case-view/services/view-cases.service';
import { loadCasesFailure, loadCasesSuccess } from '../../actions';
import { ViewQuotation } from '../../models';

/**
 * Effect class for all view case related actions
 */
@Injectable()
export class ViewCasesEffect {
  /**
   * Get all cases for the authenticated user
   */
  loadCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) => routerState.url.indexOf(AppRoutePath.CaseViewPath) >= 0
      ),
      mergeMap(() =>
        this.viewCasesService.getCases().pipe(
          map((quotations: ViewQuotation[]) =>
            loadCasesSuccess({ quotations })
          ),
          catchError((errorMessage) => of(loadCasesFailure({ errorMessage })))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly viewCasesService: ViewCasesService
  ) {}
}
