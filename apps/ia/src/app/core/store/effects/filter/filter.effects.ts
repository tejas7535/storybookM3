import { Injectable } from '@angular/core';

import { catchError, EMPTY, filter, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import {
  routerNavigationAction,
  routerRequestAction,
  RouterRequestPayload,
} from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { Moment } from 'moment';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { FilterService } from '../../../../filter-section/filter.service';
import { LossOfSkillTab } from '../../../../loss-of-skill/models';
import {
  clearLossOfSkillDimensionData,
  setLossOfSkillSelectedTab,
} from '../../../../loss-of-skill/store/actions/loss-of-skill.actions';
import { getLossOfSkillSelectedTab } from '../../../../loss-of-skill/store/selectors/loss-of-skill.selector';
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
  resetTimeRangeFilter,
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
      ofType(routerNavigationAction, setLossOfSkillSelectedTab),
      concatLatestFrom(() => [
        this.store.select(selectRouterState),
        this.store.select(getLossOfSkillSelectedTab),
      ]),
      map(([_, routerStateAction, selectedTab]) => ({
        url: routerStateAction.state.url,
        selectedTab,
      })),
      mergeMap((data) => {
        if (
          this.includesLostPerformancePath(data.url) &&
          data.selectedTab === LossOfSkillTab.PERFORMANCE
        ) {
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

  resetTimeRangeFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerRequestAction, setLossOfSkillSelectedTab),
      concatLatestFrom(() => [this.store.select(getLossOfSkillSelectedTab)]),
      map(([action, selectedTab]) => ({
        action,
        selectedTab,
      })),
      filter(({ action, selectedTab }) => {
        // Handle router navigation
        if (action.type === routerRequestAction.type) {
          return (
            this.leavingLostPerformancePath(action.payload) &&
            selectedTab === LossOfSkillTab.PERFORMANCE
          );
        }

        // Handle tab selection
        return selectedTab !== LossOfSkillTab.PERFORMANCE;
      }),
      mergeMap(() => {
        return of(resetTimeRangeFilter());
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

  private includesLostPerformancePath(url: string): boolean {
    return url.includes(AppRoutePath.LostPerformancePath);
  }

  private leavingLostPerformancePath(payload: RouterRequestPayload): boolean {
    return (
      !this.includesLostPerformancePath(payload.event.url) &&
      this.includesLostPerformancePath(payload.routerState.url)
    );
  }
}
