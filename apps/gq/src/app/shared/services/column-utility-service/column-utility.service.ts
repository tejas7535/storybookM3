import { Injectable } from '@angular/core';

import { ColDef, ValueFormatterParams } from '@ag-grid-community/all-modules';

import { CalculationType } from '../../../core/store/reducers/sap-price-details/models/calculation-type.enum';
import { Keyboard } from '../../models';
import { DateDisplayPipe } from '../../pipes/date-display/date-display.pipe';
import { GqQuotationPipe } from '../../pipes/gq-quotation/gq-quotation.pipe';
import { MaterialTransformPipe } from '../../pipes/material-transform/material-transform.pipe';
import { UserRoles } from '../../roles/user-roles.enum';
import { HelperService } from '../helper-service/helper-service.service';
import { PriceService } from '../price-service/price.service';
import { ColumnFields } from './column-fields.enum';

@Injectable({
  providedIn: 'root',
})
export class ColumnUtilityService {
  static dateFilterParams = {
    comparator: (compareDate: Date, cellDate: string) => {
      const newCellDate = new Date(cellDate);
      newCellDate.setHours(0, 0, 0, 0);

      const parsedCompareDate = compareDate.getTime();
      const parsedCellDate = newCellDate.getTime();

      if (parsedCompareDate === parsedCellDate) {
        return 0;
      }

      if (parsedCompareDate < parsedCellDate) {
        return 1;
      }
      if (parsedCompareDate > parsedCellDate) {
        return -1;
      }

      // this is just a default that never happens
      return 0;
    },
    buttons: ['reset'],
  };

  static createColumnDefs(roles: string[], colDefs: ColDef[]): ColDef[] {
    return colDefs.filter(
      (col: ColDef) =>
        ColumnUtilityService.filterGpc(col, roles) &&
        ColumnUtilityService.filterSqv(col, roles)
    );
  }
  static filterGpc(col: ColDef, roles: string[]): boolean {
    return col.field === ColumnFields.GPC || col.field === ColumnFields.GPI
      ? roles.includes(UserRoles.COST_GPC)
      : true;
  }

  static filterSqv(col: ColDef, roles: string[]): boolean {
    return col.field === ColumnFields.SQV || col.field === ColumnFields.GPM
      ? roles.includes(UserRoles.COST_SQV)
      : true;
  }

  static numberFormatter(data: ValueFormatterParams): string {
    return HelperService.transformNumber(data.value, false);
  }

  static numberDashFormatter(data: ValueFormatterParams): string {
    return HelperService.transformNumber(data.value, false) ?? Keyboard.DASH;
  }

  static numberCurrencyFormatter(params: ValueFormatterParams): string {
    const formattedNumber = HelperService.transformNumber(params.value, true);

    return HelperService.transformNumberCurrency(
      formattedNumber,
      params.context.quotation.customer.currency
    );
  }

  static sapConditionAmountFormatter(params: ValueFormatterParams): string {
    if (params.data.calculationType === CalculationType.ABSOLUT) {
      return ColumnUtilityService.numberCurrencyFormatter(params);
    }

    return ColumnUtilityService.percentageFormatter(params);
  }

  static percentageFormatter(data: ValueFormatterParams): string {
    return HelperService.transformPercentage(
      PriceService.roundToTwoDecimals(data.value)
    );
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

  static basicTransform(data: ValueFormatterParams): string {
    return data.value || Keyboard.DASH;
  }
  static blankTransform(data: ValueFormatterParams): string {
    return data.value || '';
  }
  static dateFormatter(data: any): string {
    const datePipe = new DateDisplayPipe();

    return datePipe.transform(data.value);
  }

  static idFormatter(data: any): string {
    const pipe = new GqQuotationPipe();

    return pipe.transform(data.value);
  }
  static transformPer(): string {
    return '1';
  }
}
