import { createSelector } from '@ngrx/store';

import { Filter } from '../../../../shared/models';
import { getEmployeeState } from '../../reducers';
import { EmployeeState } from '../../reducers/employee/employee.reducer';

export const getInitialFiltersLoading = createSelector(
  getEmployeeState,
  (state: EmployeeState) => state.filters.loading
);

export const getOrganizations = createSelector(
  getEmployeeState,
  (state: EmployeeState) =>
    new Filter('organizations', state.filters.organizations)
);
