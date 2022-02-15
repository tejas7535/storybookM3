import { translate } from '@ngneat/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import {
  EmployeesRequest,
  Filter,
  FilterKey,
  IdValue,
  SelectedFilter,
} from '../../../../shared/models';
import {
  RouterStateUrl,
  selectFilterState,
  selectRouterState,
} from '../../reducers';
import {
  FilterState,
  selectAllSelectedFilters,
} from '../../reducers/filter/filter.reducer';

export const getInitialFiltersLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.loading
);

export const getOrgUnits = createSelector(
  selectFilterState,
  (state: FilterState) => new Filter(FilterKey.ORG_UNIT, state.orgUnits)
);

export const getCurrentRoute = createSelector(
  selectRouterState,
  (state: RouterReducerState<RouterStateUrl>) => state?.state.url
);

export const getTimePeriods = createSelector(
  selectFilterState,
  (state: FilterState) =>
    state.timePeriods.map(
      (period) =>
        new IdValue(
          period.id,
          translate(`filters.periodOfTime.${period.value}`)
        )
    )
);

export const getSelectedTimePeriod = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedTimePeriod
);

export const getSelectedTimeRange = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedTimeRange
);

export const getBeautifiedSelectedTimeRange = createSelector(
  getSelectedTimeRange,
  (timeRange: string) => {
    const dates = timeRange?.split('|');

    return timeRange
      ? `${new Date(+dates[0]).toLocaleDateString('en-US')} - ${new Date(
          +dates[1]
        ).toLocaleDateString('en-US')}`
      : undefined;
  }
);

export const getSelectedFilters = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedFilters
);

export const getAllSelectedFilters = createSelector(
  getSelectedFilters,
  selectAllSelectedFilters
);

export const getCurrentFiltersAndTime = createSelector(
  getSelectedTimeRange,
  getAllSelectedFilters,
  (timeRange: string, filters: SelectedFilter[]) =>
    // eslint-disable-next-line unicorn/no-array-reduce
    filters.reduce(
      (map: any, filter) => {
        map[filter.name] = filter.value;

        return map;
      },
      {
        [FilterKey.TIME_RANGE]: timeRange,
      } as unknown as EmployeesRequest
    )
);

export const getSelectedOrgUnit = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters
      .find((filter) => filter.name === FilterKey.ORG_UNIT)
      ?.value?.toString()
);

export const getSelectedFilterValues = createSelector(
  getAllSelectedFilters,
  getBeautifiedSelectedTimeRange,
  (filters: SelectedFilter[], timeRange: string) => [
    ...filters.map((filter) => filter.value),
    timeRange,
  ]
);
