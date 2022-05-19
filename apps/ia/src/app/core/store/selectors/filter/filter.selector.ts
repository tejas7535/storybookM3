import { translate } from '@ngneat/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import {
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

export const getOrgUnitsFilter = createSelector(
  selectFilterState,
  (state: FilterState) => new Filter(FilterKey.ORG_UNIT, state.orgUnits.items)
);

export const getOrgUnitsLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.orgUnits.loading
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
  (filters: SelectedFilter[]) =>
    // eslint-disable-next-line unicorn/no-array-reduce
    filters.reduce((filterMap: any, filter) => {
      filterMap[filter.name] = filter.idValue.id;

      return filterMap;
    }, {})
);

export const getSelectedOrgUnit = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters.find((filter) => filter.name === FilterKey.ORG_UNIT)?.idValue
);

export const getSelectOrgUnitValueShort = createSelector(
  getSelectedOrgUnit,
  (val: IdValue) => val?.value?.split('(')[0].trim()
);

export const getSelectedTimeRange = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters.find((filter) => filter.name === FilterKey.TIME_RANGE)?.idValue
);

export const getSelectedFilterValues = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) => [
    ...filters.map((filter) => filter.idValue.value),
  ]
);
