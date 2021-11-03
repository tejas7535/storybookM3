import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { triggerLoad } from '../../../core/store/actions';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { FeatureChange } from '../../models';
import {
  changeOrderOfFeatures,
  changeSelectedFeatures,
  initializeSelectedFeatures,
  loadAvailableFeatures,
  loadAvailableFeaturesFailure,
  loadAvailableFeaturesSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from '../actions/attrition-analytics.action';
import {
  getSelectedFeatureParams,
  getSelectedFeatures,
} from '../selectors/attrition-analytics.selector';
import {
  didFeaturesChange,
  sortFeaturesBasedOnParams,
} from './attrition-analytics.effects.utils';

@Injectable()
export class AttritionAnalyticsEffects implements OnInitEffects {
  loadAvailableFeatures$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAvailableFeatures),
      switchMap(() =>
        this.attritionAnalyticsService.getAvailableFeatures().pipe(
          map((data) => loadAvailableFeaturesSuccess({ data })),
          catchError((error) =>
            of(loadAvailableFeaturesFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  loadEmployeeAnalytics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadEmployeeAnalytics),
      switchMap((result) =>
        this.attritionAnalyticsService.getEmployeeAnalytics(result.params).pipe(
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
        this.store.select(getSelectedFeatureParams).pipe(
          // eslint-disable-next-line ngrx/avoid-mapping-selectors
          map((featuresSelectedByUser) => {
            const features = featuresSelectedByUser ?? data.features;

            return changeSelectedFeatures({ features });
          })
        )
      )
    );
  });

  changeSelectedFeatures$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(changeSelectedFeatures),
      withLatestFrom(this.store.select(getSelectedFeatures)),
      map(([params, currentSelectedFilters]) =>
        didFeaturesChange(params.features, currentSelectedFilters)
      ),
      switchMap((change: FeatureChange) =>
        change.didChange
          ? of(loadEmployeeAnalytics({ params: change.features }))
          : of(changeOrderOfFeatures({ features: change.features }))
      )
    );
  });

  changeOrderOfFeatures$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(changeOrderOfFeatures),
      withLatestFrom(this.store.select(getSelectedFeatures)),
      map(([params, features]) =>
        sortFeaturesBasedOnParams(features, params.features)
      ),
      switchMap((features) =>
        of(loadEmployeeAnalyticsSuccess({ data: features }))
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly attritionAnalyticsService: AttritionAnalyticsService
  ) {}

  ngrxOnInitEffects(): Action {
    this.store.dispatch(loadAvailableFeatures());

    return triggerLoad();
  }
}
