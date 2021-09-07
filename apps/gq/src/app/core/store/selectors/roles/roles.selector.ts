import { ColDef } from '@ag-grid-community/core';
import { createSelector } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { RoleGroup } from '../../../../shared/models';
import { UserRoles } from '../../../../shared/roles/user-roles.enum';
import { ColumnUtilityService } from '../../../../shared/services/column-utility-service/column-utility.service';

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
export const getColumnDefsForRoles = (colDef: ColDef[]) =>
  createSelector(getRoles, (roles) =>
    ColumnUtilityService.createColumnDefs(roles, colDef)
  );

export const filterRoles = (roles: string[], prefix: string): string[] =>
  roles.filter((role) => role.includes(prefix));

export const userHasGPCRole = createSelector(
  getRoles,
  (roles: string[]): boolean => roles.includes(UserRoles.COST_GPC)
);
export const userHasManualPriceRole = createSelector(
  getRoles,
  (roles: string[]): boolean => roles.includes(UserRoles.MANUAL_PRICE)
);
export const userHasSQVRole = createSelector(
  getRoles,
  (roles: string[]): boolean => roles.includes(UserRoles.COST_SQV)
);
