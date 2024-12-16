import { map, pipe } from 'rxjs';

import { createSelector } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { adminRoles, RolePrefix } from '@cdba/core/auth/auth.config';
import { RoleDescriptions } from '@cdba/core/auth/models/roles.models';

import { getRolesState } from '../../reducers';
import { RolesState } from '../../reducers/roles/roles.reducer';

export const getRoleDescriptions = createSelector(
  getRolesState,
  (state: RolesState): RoleDescriptions => state.roleDescriptions.items
);

export const getRoleDescriptionsLoaded = createSelector(
  getRolesState,
  (state: RolesState) => state.roleDescriptions.loaded
);

export const getRoleDescriptionsErrorMessage = createSelector(
  getRolesState,
  (state: RolesState) => state.roleDescriptions.errorMessage
);

export const getHasDescriptiveRoles = pipe(
  getRoles,
  map((roles): boolean => {
    if (roles.some((role) => adminRoles.includes(role))) {
      return true;
    }

    const plRoles = roles.filter((role) =>
      role.startsWith(RolePrefix.ProductLine)
    );
    const srRoles = roles.filter((role) =>
      role.startsWith(RolePrefix.SubRegion)
    );

    return plRoles.length > 0 && srRoles.length > 0;
  })
);
