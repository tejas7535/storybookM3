import { Injectable } from '@angular/core';

import { catchError, EMPTY, filter, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { Moment } from 'moment';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { FilterService } from '../../../../filter-section/filter.service';
import { clearLossOfSkillDimensionData } from '../../../../loss-of-skill/store/actions/loss-of-skill.actions';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
} from '../../../../overview/store/actions/overview.action';
import {
  DEFAULT_TIME_PERIOD_FILTERS,
  LOSS_OF_SKILL_MIN_YEAR,
} from '../../../../shared/constants';
import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import {
  getTimeRangeFromDates,
  getToday,
} from '../../../../shared/utils/utilities';
import { loadUserSettingsDimensionData } from '../../../../user/store/actions/user.action';
import {
  activateTimePeriodFilters,
  autocompleteBenchmarkDimensionData,
  autocompleteDimensionData,
  benchmarDimensionSelected,
  benchmarkFilterSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
  setAvailableTimePeriods,
} from '../../actions';
import { selectRouterState } from '../../reducers';
import {
  getBenchmarkIdValue,
  getCurrentFilters,
  getSelectedBenchmarkValue,
  getSelectedDimensionIdValue,
  getSelectedTimeRange,
} from '../../selectors';

@Injectable()
export class FilterEffects {
  // clear dimension's data when user changed the dimension during loading
  dimensionSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFilterDimensionData),
      concatLatestFrom(() => this.store.select(getCurrentFilters)),
      filter(
        ([_action, dimensionFilter]) =>
          !dimensionFilter.filterDimension ||
          !dimensionFilter.timeRange ||
          !dimensionFilter.value
      ),
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
        autocompleteDimensionData,
        autocompleteBenchmarkDimensionData,
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
        return selectedDimensionIdValue?.id
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

  setTimePeriodsFiltersForCurrentTab$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigationAction),
      concatLatestFrom(() => this.store.select(selectRouterState)),
      map(([_, routerStateAction]) => routerStateAction.state.url),
      mergeMap((url) => {
        if (url === `/${AppRoutePath.LostPerformancePath}`) {
          const lossOfSkillTimePeriods = [
            { id: TimePeriod.YEAR, value: TimePeriod.YEAR },
          ];
          const lossOfSkillMinDate = this.getStartOfPreviousYearDate();
          const lossOfSkillMaxDate = this.getEndOfPreviousYearDate();

          return of(
            activateTimePeriodFilters({
              timePeriods: lossOfSkillTimePeriods,
              activeTimePeriod: TimePeriod.YEAR,
              timeRange: {
                id: getTimeRangeFromDates(
                  lossOfSkillMinDate,
                  lossOfSkillMaxDate
                ),
                value: lossOfSkillMaxDate.year().toString(),
              },
              timeRangeConstraints: {
                min: getToday()
                  .clone()
                  .year(LOSS_OF_SKILL_MIN_YEAR)
                  .startOf('year')
                  .unix(),
                max: lossOfSkillMaxDate.unix(),
              },
            })
          );
        } else {
          return of(
            setAvailableTimePeriods({
              timePeriods: DEFAULT_TIME_PERIOD_FILTERS,
            })
          );
        }
      })
    );
  });

  getStartOfPreviousYearDate = (): Moment =>
    getToday().clone().subtract(1, 'year').startOf('year');
  getEndOfPreviousYearDate = (): Moment =>
    getToday().clone().subtract(1, 'year').endOf('year');

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}
}
