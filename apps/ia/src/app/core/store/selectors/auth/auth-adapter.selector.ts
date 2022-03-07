import { createSelector } from '@ngrx/store';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { Role, RolesGroup } from '@schaeffler/roles-and-rights';

export const getUserRoles = createSelector(
  getBackendRoles,
  (roles: string[]) =>
    roles?.map(
      (role) =>
        ({
          title: 'Insight Attrition',
          roles: [{ title: role } as Role],
        } as RolesGroup)
    ) || []
);
