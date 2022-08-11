import { translate } from '@ngneat/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import {
  Filter,
  FilterDimension,
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

export const getSelectedDimension = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedDimension
);

export const getBusinessAreaFilter = createSelector(
  selectFilterState,
  getSelectedDimension,
  (state: FilterState, selectedDimension: FilterDimension) =>
    state.data[selectedDimension]
      ? new Filter(
          Object.entries(FilterDimension).find(
            ([_, value]) => value === selectedDimension
          )?.[1],
          state.data[selectedDimension].items
        )
      : undefined
);

export const getOrgUnitsLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.data.orgUnit.loading
);

export const getBusinessAreaLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.data[state.selectedDimension]?.loading
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

export const getSelectedFilters = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedFilters
);

export const getAllSelectedFilters = createSelector(
  getSelectedFilters,
  selectAllSelectedFilters
);

export const getCurrentFilters = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) =>
    filters
      .filter(
        (filter) =>
          filter.name === selectedDimension ||
          filter.name === FilterKey.TIME_RANGE
      )
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((filterMap: any, filter) => {
        filterMap[filter.name] = filter.idValue.id;

        return filterMap;
      }, {})
);

export const getSelectedBusinessArea = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) =>
    filters.find((filter) => filter.name === selectedDimension)?.idValue
);

export const getSelectOrgUnitValueShort = createSelector(
  getSelectedBusinessArea,
  (val: IdValue) => val?.value?.split('(')[0].trim()
);

export const getSelectedTimeRange = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters.find((filter) => filter.name === FilterKey.TIME_RANGE)?.idValue
);

export const getSelectedFilterValues = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) => [
    ...filters
      .filter(
        (filter) =>
          filter.name === FilterKey.TIME_RANGE ||
          filter.name === selectedDimension
      )
      .map((filter) => filter.idValue.value),
  ]
);
