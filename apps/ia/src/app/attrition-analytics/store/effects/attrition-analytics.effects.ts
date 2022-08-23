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
import {
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
  selectRegion,
} from '../actions/attrition-analytics.action';
import {
  getFeatureImportanceHasNext,
  getFeatureImportancePageable,
  getFeatureImportanceSort,
  getMonthFromCurrentFilters,
  getSelectedFeatureParams,
  getSelectedFeatures,
  getSelectedRegion,
  getYearFromCurrentFilters,
} from '../selectors/attrition-analytics.selector';

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

  selectRegion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectRegion),
      concatLatestFrom(() => this.store.select(getSelectedFeatureParams)),
      mergeMap(([region, selectedFeatureParams]) =>
        of(
          loadEmployeeAnalytics({
            params: selectedFeatureParams?.filter(
              (feature) => feature.region === region.selectedRegion
            ),
          })
        )
      )
    );
  });

  changeSelectedFeatures$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(changeSelectedFeatures),
      withLatestFrom(
        this.store.select(getSelectedFeatures),
        this.store.select(getSelectedRegion)
      ),
      tap(([action, _filters]) =>
        this.stateService.setSelectedFeatures(action.features)
      ),
      switchMap(([params, _filters, selectedRegion]) =>
        of(
          loadEmployeeAnalytics({
            params: params.features.filter(
              (feature) => feature.region === selectedRegion
            ),
          })
        )
      )
    );
  });

  loadNextFeatureImportance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFeatureImportance, selectRegion),
      withLatestFrom(
        this.store.select(getFeatureImportanceHasNext),
        this.store.select(getFeatureImportancePageable),
        this.store.select(getFeatureImportanceSort),
        this.store.select(getSelectedRegion),
        this.store.select(getYearFromCurrentFilters),
        this.store.select(getMonthFromCurrentFilters)
      ),
      filter(
        ([_action, hasNext, _pageable, _sort, selectedRegion, year, month]) =>
          hasNext && !!selectedRegion && !!year && !!month
      ),
      switchMap(
        ([_action, _hasNext, pageable, sort, selectedRegion, year, month]) =>
          this.attritionAnalyticsService
            .getFeatureImportance(
              selectedRegion,
              year,
              month,
              pageable.pageNumber + 1, // load next features
              pageable.pageSize,
              sort.property,
              sort.direction
            )
            .pipe(
              map((data) => loadFeatureImportanceSuccess({ data })),
              catchError((error) =>
                of(
                  loadFeatureImportanceFailure({ errorMessage: error.message })
                )
              )
            )
      )
    );
  });

  loadFeatureImportance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAvailableFeaturesSuccess),
      switchMap(() => of(loadFeatureImportance()))
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
    const selectedFeatures = this.stateService.getSelectedFeatures();
    if (selectedFeatures.length > 0) {
      this.store.dispatch(
        selectRegion({
          // get latest saved feature's region
          selectedRegion: selectedFeatures[selectedFeatures.length - 1].region,
        })
      );
    }

    this.store.dispatch(
      initializeSelectedFeatures({
        features: selectedFeatures,
      })
    );

    return triggerLoad();
  }
}
