import { createSelector } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { RoleGroup } from '../../../../shared/role-modal/models/role-group.model';
import { UserRoles } from '../../../../shared/roles/user-roles.enum';

export const getAllRoles = createSelector(
  getRoles,
  (roles: string[]): RoleGroup[] =>
    roles
      ? [
          {
            key: 'geoRoles',
            roles: filterRoles(roles, UserRoles.REGION_PREFIX),
          },
          {
            key: 'sectoralRoles',
            roles: filterRoles(roles, UserRoles.SECTOR_PREFIX),
          },
          {
            key: 'costRoles',
            roles: filterRoles(roles, UserRoles.COST_PREFIX),
          },
          {
            key: 'priceRoles',
            roles: filterRoles(roles, UserRoles.MANUAL_PRICE),
          },
        ]
      : []
);

export const filterRoles = (roles: string[], prefix: string): string[] =>
  roles.filter((role) => role.includes(prefix));

export const userHasGPCRole = createSelector(
  getRoles,
  (roles: String[]): boolean => roles.includes(UserRoles.COST_GPC)
);
