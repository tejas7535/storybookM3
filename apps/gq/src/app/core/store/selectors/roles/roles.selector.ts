import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import { createSelector } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { ColumnUtilityService } from '../../../../shared/ag-grid/services/column-utility.service';
import { UserRoles } from '../../../../shared/constants/user-roles.enum';

export const getAllRoles = pipe(
  getRoles,
  map((roles) => [
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
  ])
);
export const getColumnDefsForRoles = (colDef: ColDef[]) =>
  createSelector(
    getRoles,
    map((roles) => ColumnUtilityService.createColumnDefs(roles, colDef))
  );

export const filterRoles = (roles: string[], prefix: string): string[] =>
  roles.filter((role) => role.includes(prefix));

export const userHasGPCRole = pipe(
  getRoles,
  map((roles: string[]): boolean => roles.includes(UserRoles.COST_GPC))
);
export const userHasManualPriceRole = pipe(
  getRoles,
  map((roles: string[]): boolean => roles.includes(UserRoles.MANUAL_PRICE))
);
export const userHasSQVRole = pipe(
  getRoles,
  map((roles: string[]): boolean => roles.includes(UserRoles.COST_SQV))
);
