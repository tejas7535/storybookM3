import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import {
  EmployeesRequest,
  Filter,
  IdValue,
  SelectedFilter,
} from '../../../../shared/models';
import { selectEmployeeState } from '../../reducers';
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
  (state: EmployeeState) => new Filter('orgUnit', state.filters.orgUnits)
);

export const getRegionsAndSubRegions = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter('regionOrSubRegion', state.filters.regionsAndSubRegions)
);

export const getCountries = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => new Filter('country', state.filters.countries)
);

export const getHrLocations = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => new Filter('hrLocation', state.filters.hrLocations)
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
        timeRange,
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
