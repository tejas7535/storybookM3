import { Injectable } from '@angular/core';

import { ColDef, ValueFormatterParams } from '@ag-grid-community/all-modules';

import { GqQuotationPipe } from '../../pipes/gq-quotation.pipe';
import { MaterialTransformPipe } from '../../pipes/material-transform.pipe';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';
import { UserRoles } from '../../roles/user-roles.enum';
import { ColumnFields } from './column-fields.enum';

@Injectable({
  providedIn: 'root',
})
export class ColumnUtilityService {
  static createColumnDefs(
    roles: string[],
    showAddedToOffer: boolean,
    colDefs: ColDef[]
  ): ColDef[] {
    return colDefs.filter(
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

  static transformNumber(value: number, colId: string): string {
    const pipe = new NumberFormatPipe();

    return pipe.transform(value, colId);
  }

  static numberFormatter(data: ValueFormatterParams): string {
    return ColumnUtilityService.transformNumber(
      data.value,
      data.column['colId']
    );
  }

  static numberCurrencyFormatter(params: ValueFormatterParams): string {
    const formattedNumber = ColumnUtilityService.transformNumber(
      params.value,
      params.column['colId']
    );

    const value = formattedNumber
      ? `${formattedNumber} ${params.context.currency}`
      : undefined;

    return value;
  }

  static percentageFormatter(data: ValueFormatterParams): string {
    return data.value ? `${data.value} %` : '';
  }

  static infoComparator(info1: any, info2: any): number {
    const valid1 = info1.valid;
    const valid2 = info2.valid;

    if (valid1 === valid2) {
      return 0;
    }
    if (valid1 && !valid2) {
      return 1;
    }
    if (valid2 && !valid1) {
      return -1;
    }

    return 0;
  }

  static transformMaterial(data: ValueFormatterParams): string {
    const materialPipe = new MaterialTransformPipe();

    return materialPipe.transform(data.value);
  }

  static dateFormatter(data: any): string {
    return data.value ? new Date(data.value).toLocaleDateString() : '';
  }

  static idFormatter(data: any): string {
    const pipe = new GqQuotationPipe();

    return pipe.transform(data.value);
  }
  static transformPer(): string {
    return '1';
  }
}
