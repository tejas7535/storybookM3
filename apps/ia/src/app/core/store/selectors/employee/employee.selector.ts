import { translate } from '@ngneat/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ChartType } from '../../../../overview/models/chart-type.enum';
import {
  EmployeesRequest,
  Filter,
  FilterKey,
  IdValue,
  SelectedFilter,
} from '../../../../shared/models';
import {
  RouterStateUrl,
  selectEmployeeState,
  selectRouterState,
} from '../../reducers';
import {
  EmployeeState,
  selectAllSelectedEmployees,
} from '../../reducers/employee/employee.reducer';

export const getInitialFiltersLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.loading
);

export const getOrgUnits = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(FilterKey.ORG_UNIT, state.filters.orgUnits)
);

export const getRegionsAndSubRegions = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(
      FilterKey.REGION_OR_SUB_REGION,
      state.filters.regionsAndSubRegions
    )
);

export const getCountries = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(FilterKey.COUNTRY, state.filters.countries)
);

export const getHrLocations = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(FilterKey.HR_LOCATION, state.filters.hrLocations)
);

export const getCurrentRoute = createSelector(
  selectRouterState,
  (state: RouterReducerState<RouterStateUrl>) => {
    return state?.state.url;
  }
);

export const getTimePeriods = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    state.filters.timePeriods.map(
      (period) =>
        new IdValue(
          period.id,
          translate(`filters.periodOfTime.${period.value}`)
        )
    )
);

export const getSelectedTimePeriod = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.selectedTimePeriod
);

export const getSelectedTimeRange = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.selectedTimeRange
);

export const getSelectedFilters = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.selectedFilters
);

export const getAllSelectedFilters = createSelector(
  getSelectedFilters,
  selectAllSelectedEmployees
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

export const getEmployees = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.employees.result
);

export const getEmployeesLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.employees.loading
);

export const getSelectedOverviewChartType = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.overview.selectedChart
);

export const showRegionsAndLocationsFilters = createSelector(
  getCurrentRoute,
  getSelectedOverviewChartType,
  (route: string, type: ChartType) => {
    // hide if overview page and org chart (default) is selected
    return !(
      route &&
      route === `/${AppRoutePath.OverviewPath}` &&
      type === ChartType.ORG_CHART
    );
  }
);
