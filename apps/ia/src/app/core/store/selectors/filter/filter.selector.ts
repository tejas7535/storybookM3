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

export const getRegionsAndSubRegions = createSelector(
  selectFilterState,
  (state: FilterState) =>
    new Filter(FilterKey.REGION_OR_SUB_REGION, state.regionsAndSubRegions)
);

export const getCountries = createSelector(
  selectFilterState,
  (state: FilterState) => new Filter(FilterKey.COUNTRY, state.countries)
);

export const getHrLocations = createSelector(
  selectFilterState,
  (state: FilterState) => new Filter(FilterKey.HR_LOCATION, state.hrLocations)
);

export const getCurrentRoute = createSelector(
  selectRouterState,
  (state: RouterReducerState<RouterStateUrl>) => {
    return state?.state.url;
  }
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
    filters.reduce(
      (map: any, filter) => {
        map[filter.name] = filter.value;

        return map;
      },
      ({
        [FilterKey.TIME_RANGE]: timeRange,
      } as unknown) as EmployeesRequest
    )
);

export const getSelectedOrgUnit = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters.find((filter) => filter.name === FilterKey.ORG_UNIT)?.value
);
