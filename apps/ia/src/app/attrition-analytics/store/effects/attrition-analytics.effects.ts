import { Injectable } from '@angular/core';

import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { triggerLoad } from '../../../core/store/actions';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { AttritionAnalyticsStateService } from '../../attrition-analytics-state.service';
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
  loadFeatureImportance,
  loadFeatureImportanceFailure,
  loadFeatureImportanceSuccess,
  toggleFeatureImportanceSort,
} from '../actions/attrition-analytics.action';
import {
  getFeatureImportanceHasNext,
  getFeatureImportancePageable,
  getFeatureImportanceSort,
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
      concatLatestFrom(() => this.store.select(getSelectedFeatures)),
      tap(([action]) => this.stateService.setSelectedFeatures(action.features)),
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
      concatLatestFrom(() => this.store.select(getSelectedFeatures)),
      map(([params, features]) =>
        sortFeaturesBasedOnParams(features, params.features)
      ),
      switchMap((features) =>
        of(loadEmployeeAnalyticsSuccess({ data: features }))
      )
    );
  });

  loadNextFeatureImportance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFeatureImportance, toggleFeatureImportanceSort),
      withLatestFrom(
        this.store.select(getFeatureImportanceHasNext),
        this.store.select(getFeatureImportancePageable),
        this.store.select(getFeatureImportanceSort)
      ),
      filter(([_action, hasNext, _pageable, _sort]) => hasNext),
      switchMap(([_action, _hasNext, pageable, sort]) =>
        this.attritionAnalyticsService
          .getFeatureImportance(
            'China', // hardcoded for now
            2020,
            8,
            pageable.pageNumber + 1, // load next features
            pageable.pageSize,
            sort.property,
            sort.direction
          )
          .pipe(
            map((data) => loadFeatureImportanceSuccess({ data })),
            catchError((error) =>
              of(loadFeatureImportanceFailure({ errorMessage: error.message }))
            )
          )
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly attritionAnalyticsService: AttritionAnalyticsService,
    private readonly stateService: AttritionAnalyticsStateService
  ) {}

  ngrxOnInitEffects(): Action {
    // load available features
    this.store.dispatch(loadAvailableFeatures());

    // set default features
    this.store.dispatch(
      initializeSelectedFeatures({
        features: this.stateService.getSelectedFeatures(),
      })
    );

    // load feature importance shap data
    this.store.dispatch(loadFeatureImportance());

    return triggerLoad();
  }
}
