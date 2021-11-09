import { createSelector } from '@ngrx/store';

import { RoleDescriptions } from '@cdba/core/auth/models/roles.models';
import { RolesState } from '@cdba/core/store/reducers/roles/models/roles-state.model';

import { getRolesState } from '../../reducers';

export const getRoleDescriptions = createSelector(
  getRolesState,
  (state: RolesState): RoleDescriptions => state.roleDescriptions.items
);

export const getRoleDescriptionsLoading = createSelector(
  getRolesState,
  (state: RolesState) => state.roleDescriptions.loading
);

export const getRoleDescriptionsErrorMessage = createSelector(
  getRolesState,
  (state: RolesState) => state.roleDescriptions.errorMessage
);
