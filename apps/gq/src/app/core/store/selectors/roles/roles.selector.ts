import { createSelector } from '@ngrx/store';

import { getClaim } from '@schaeffler/auth';

import { UserRoles } from '../../../../shared/roles/user-roles.enum';
import { RoleGroup } from '../../models';

export const getAllRoles = createSelector(
  getClaim('roles'),
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
