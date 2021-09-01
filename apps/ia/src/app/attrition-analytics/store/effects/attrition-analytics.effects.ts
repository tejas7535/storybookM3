import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { triggerLoad } from '../../../core/store/actions';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import {
  changeSelectedFeatures,
  initializeSelectedFeatures,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from '../actions/attrition-analytics.action';
import { getSelectedFeatureNames } from '../selectors/attrition-analytics.selector';

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

  initializeSelectedFeatures$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeSelectedFeatures),
      mergeMap((data) =>
        this.store.select(getSelectedFeatureNames).pipe(
          // eslint-disable-next-line ngrx/avoid-mapping-selectors
          map((features) =>
            !features
              ? changeSelectedFeatures({
                  features: data.features,
                })
              : changeSelectedFeatures({ features })
          )
        )
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly attritionAnalyticsService: AttritionAnalyticsService
  ) {}

  ngrxOnInitEffects(): Action {
    return triggerLoad();
  }
}
