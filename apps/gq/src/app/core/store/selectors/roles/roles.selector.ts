import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { ColumnUtilityService } from '@gq/shared/ag-grid/services';
import { UserRoles } from '@gq/shared/constants';
import { createSelector } from '@ngrx/store';
import { ColDef } from 'ag-grid-enterprise';

import { getRoles } from '@schaeffler/azure-auth';

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

export const userHasRole = (role: UserRoles) =>
  createSelector(
    getRoles,
    map((roles: string[]): boolean => roles.includes(role))
  );

export const userHasGPCRole = userHasRole(UserRoles.COST_GPC);
export const userHasManualPriceRole = userHasRole(UserRoles.MANUAL_PRICE);
export const userHasSQVRole = userHasRole(UserRoles.COST_SQV);
export const userHasRegionAmericasRole = userHasRole(UserRoles.REGION_AMERICAS);
export const userHasRegionWorldRole = userHasRole(UserRoles.REGION_WORLD);
export const userHasRegionGreaterChinaRole = userHasRole(
  UserRoles.REGION_GREATER_CHINA
);
