import { ColDef } from '@ag-grid-enterprise/all-modules';
import { createSelector } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { ColumnUtilityService } from '../../../../shared/ag-grid/services/column-utility.service';
import { UserRoles } from '../../../../shared/constants/user-roles.enum';
import { RoleGroup } from '../../../../shared/models';

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
