import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { Filter, IdValue } from '../../../../shared/models';
import { selectEmployeeState } from '../../reducers';
import { EmployeeState } from '../../reducers/employee/employee.reducer';

export const getInitialFiltersLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.loading
);

export const getOrganizations = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter('organizations', state.filters.organizations)
);

export const getRegionsAndSubRegions = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter('regionsAndSubRegions', state.filters.regionsAndSubRegions)
);

export const getCountries = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => new Filter('countries', state.filters.countries)
);

export const getLocations = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => new Filter('locations', state.filters.locations)
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
