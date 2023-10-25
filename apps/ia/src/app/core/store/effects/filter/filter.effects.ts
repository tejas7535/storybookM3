import { Injectable } from '@angular/core';

import { catchError, EMPTY, filter, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FilterService } from '../../../../filter-section/filter.service';
import { clearLossOfSkillDimensionData } from '../../../../loss-of-skill/store/actions/loss-of-skill.actions';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
} from '../../../../overview/store/actions/overview.action';
import { IdValue, SelectedFilter } from '../../../../shared/models';
import { loadUserSettingsDimensionData } from '../../../../user/store/actions/user.action';
import {
  benchmarDimensionSelected,
  benchmarkFilterSelected,
  dimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../actions';
import {
  getBenchmarkIdValue,
  getCurrentDimensionValue,
  getSelectedBenchmarkValue,
  getSelectedDimensionIdValue,
  getSelectedTimeRange,
} from '../../selectors';

@Injectable()
export class FilterEffects {
  // clear dimension's data when user changed the dimension during loading
  dimensionSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dimensionSelected),
      concatLatestFrom(() => this.store.select(getCurrentDimensionValue)),
      filter(([_action, dimensionFilter]) => !dimensionFilter),
      mergeMap(() => [
        clearOverviewDimensionData(),
        clearLossOfSkillDimensionData(),
      ])
    );
  });

  // clear benchmark's data when user changed the dimension during loading
  benchmarkDimensionSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(benchmarDimensionSelected),
      concatLatestFrom(() => this.store.select(getSelectedBenchmarkValue)),
      filter(([_action, dimensionFilter]) => !dimensionFilter),
      mergeMap(() => [clearOverviewBenchmarkData()])
    );
  });

  loadFilterDimensionData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        loadFilterDimensionData,
        loadFilterBenchmarkDimensionData,
        loadUserSettingsDimensionData
      ),
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      mergeMap(([action, timeRange]) =>
        this.filterService
          .getDataForFilterDimension(
            action.filterDimension,
            action.searchFor,
            timeRange.id
          )
          .pipe(
            map((items: IdValue[]) =>
              loadFilterDimensionDataSuccess({
                filterDimension: action.filterDimension,
                items,
              })
            ),
            catchError((error) =>
              of(
                loadFilterDimensionDataFailure({
                  filterDimension: action.filterDimension,
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    );
  });

  loadFilterDimensionDataFilterSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFilterDimensionData),
      concatLatestFrom(() => this.store.select(getSelectedDimensionIdValue)),
      mergeMap(([action, selectedDimensionIdValue]) => {
        return selectedDimensionIdValue
          ? of(
              filterSelected({
                filter: {
                  name: action.filterDimension,
                  idValue: selectedDimensionIdValue,
                } as SelectedFilter,
              })
            )
          : EMPTY;
      })
    );
  });

  loadFilterDimensionDataBenchmarkFilterSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFilterBenchmarkDimensionData),
      concatLatestFrom(() => this.store.select(getBenchmarkIdValue)),
      mergeMap(([action, benchmarkDimensionIdValue]) => {
        return benchmarkDimensionIdValue
          ? of(
              benchmarkFilterSelected({
                filter: {
                  name: action.filterDimension,
                  idValue: benchmarkDimensionIdValue,
                } as SelectedFilter,
              })
            )
          : EMPTY;
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}
}
