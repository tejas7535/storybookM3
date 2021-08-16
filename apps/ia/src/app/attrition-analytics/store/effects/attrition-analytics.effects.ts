import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { triggerLoad } from '../../../core/store/actions';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import {
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from '../actions/attrition-analytics.action';

@Injectable()
export class AttritionAnalyticsEffects implements OnInitEffects {
  loadEmployeeAnalytics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadEmployeeAnalytics),
      mergeMap(() =>
        this.attritionAnalyticsService.getEmployeeAnalytics().pipe(
          map((data) => loadEmployeeAnalyticsSuccess({ data })),
          catchError((error) =>
            of(loadEmployeeAnalyticsFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly attritionAnalyticsService: AttritionAnalyticsService
  ) {}

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
