import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';

import { UserRoles } from '../../roles/user-roles.enum';
import { COLUMN_DEFS } from './column-defs';
import { ColumnFields } from './column-fields.enum';

@Injectable({
  providedIn: 'root',
})
export class ColumnUtilityService {
  static createColumnDefs(
    roles: string[],
    showAddedToOffer: boolean
  ): ColDef[] {
    return COLUMN_DEFS.filter(
      (col: ColDef) =>
        ColumnUtilityService.filterGpc(col, roles) &&
        ColumnUtilityService.filterSqv(col, roles) &&
        ColumnUtilityService.filterAddedToOffer(col, showAddedToOffer)
    );
  }
  static filterGpc(col: ColDef, roles: string[]): boolean {
    return col.field === ColumnFields.GPC || col.field === ColumnFields.GPI
      ? roles.includes(UserRoles.COST_GPC)
      : true;
  }

  static filterSqv(col: ColDef, roles: string[]): boolean {
    return col.field === ColumnFields.SQV
      ? roles.includes(UserRoles.COST_SQV)
      : true;
  }

  static filterAddedToOffer(col: ColDef, addedToOffer: boolean): boolean {
    return col.field === ColumnFields.ADDED_TO_OFFER ? addedToOffer : true;
  }
}
