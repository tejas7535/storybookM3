import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { CalculationType } from '../../../core/store/reducers/sap-price-details/models/calculation-type.enum';
import { getNumberFilterRegex, LOCALE_DE, LOCALE_EN } from '../../constants';
import { UserRoles } from '../../constants/user-roles.enum';
import { Keyboard } from '../../models';
import { PriceSource, QuotationDetail } from '../../models/quotation-detail';
import { LastCustomerPriceCondition } from '../../models/quotation-detail/last-customer-price-condition.enum';
import { GqQuotationPipe } from '../../pipes/gq-quotation/gq-quotation.pipe';
import { MaterialClassificationSOPPipe } from '../../pipes/material-classification-sop/material-classification-sop.pipe';
import { MaterialTransformPipe } from '../../pipes/material-transform/material-transform.pipe';
import { UomPipe } from '../../pipes/uom/uom.pipe';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { PriceService } from '../../services/price-service/price.service';
import {
  ColumnFields,
  GpcColumns,
  SqvColumns,
} from '../constants/column-fields.enum';

@Injectable({
  providedIn: 'root',
})
export class ColumnUtilityService {
  static materialPipe = new MaterialTransformPipe();
  static materialClassificationSOPPipe = new MaterialClassificationSOPPipe();

  constructor(
    private readonly helperService: HelperService,
    private readonly translocoLocaleService: TranslocoLocaleService
  ) {}

  static dateFilterParams = {
    suppressFilterButton: true,
  };
  static integerFilterParams = {
    allowedCharPattern: '\\d',
  };

  numberFilterParams = {
    allowedCharPattern: '\\d\\.\\,\\-',
    numberParser: (text: string | null) => {
      let inputText = text;

      if (!text) {
        return undefined as any;
      }
      if (
        getNumberFilterRegex(this.translocoLocaleService.getLocale()).test(
          inputText
        )
      ) {
        return HelperService.parseLocalizedInputValue(
          inputText,
          this.translocoLocaleService.getLocale()
        );
      } else if (
        this.translocoLocaleService.getLocale() === LOCALE_EN.id &&
        getNumberFilterRegex(LOCALE_DE.id).test(inputText)
      ) {
        inputText = text.replace(/,/g, Keyboard.DOT);
      }

      return Number.parseFloat(inputText);
    },
  };

  static createColumnDefs(roles: string[], colDefs: ColDef[]): ColDef[] {
    return colDefs.filter(
      (col: ColDef) =>
        ColumnUtilityService.filterGpc(col, roles) &&
        ColumnUtilityService.filterSqv(col, roles)
    );
  }
  static filterGpc(col: ColDef, roles: string[]): boolean {
    return GpcColumns.includes(col.field as ColumnFields)
      ? roles.includes(UserRoles.COST_GPC)
      : true;
  }

  static filterSqv(col: ColDef, roles: string[]): boolean {
    return SqvColumns.includes(col.field as ColumnFields)
      ? roles.includes(UserRoles.COST_SQV)
      : true;
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

  static materialTransform(data: ValueFormatterParams): string {
    return ColumnUtilityService.materialPipe.transform(data.value);
  }

  static materialGetter(params: ValueGetterParams): string {
    const detail = params.data as QuotationDetail;

    return ColumnUtilityService.materialPipe.transform(
      detail.material.materialNumber15
    );
  }

  static basicTransform(data: ValueFormatterParams): string {
    return data.value || Keyboard.DASH;
  }
  static blankTransform(data: ValueFormatterParams): string {
    return data.value || '';
  }

  static idFormatter(data: any): string {
    const pipe = new GqQuotationPipe();

    return pipe.transform(data.value);
  }
  static transformPer(): string {
    return '1';
  }

  static transformPriceSource(data: ValueFormatterParams): string {
    return data.value === PriceSource.SAP_SPECIAL
      ? 'SAP_ZP05-ZP17'
      : data.value;
  }

  static transformLastCustomerPriceCondition(
    data: ValueFormatterParams
  ): string {
    /*  lastCustomerPriceCondition is retrieved from external system (sap)
     *   this is a fallback to avoid bugs due to possible changes in the sap system
     */
    if (Object.values(LastCustomerPriceCondition).includes(data.value)) {
      return translate(
        `shared.quotationDetailsTable.lastCustomerPriceConditionOptions.${(
          data.value as string
        ).toLowerCase()}`
      );
    }

    return data.value || Keyboard.DASH;
  }

  static transformMaterialClassificationSOP(materialSOPValue: string): string {
    return ColumnUtilityService.materialClassificationSOPPipe.transform(
      materialSOPValue
    );
  }

  static transformConditionUnit(params: ValueFormatterParams): string {
    const uomPipe = new UomPipe();

    return uomPipe.transform(params.value);
  }

  numberDashFormatter(data: ValueFormatterParams): string {
    if (!data?.value) {
      return Keyboard.DASH;
    }

    return this.helperService.transformNumber(data.value, false);
  }

  numberFormatter(data: ValueFormatterParams): string {
    return this.helperService.transformNumber(data.value, false);
  }

  percentageFormatter(data: ValueFormatterParams): string {
    return this.helperService.transformPercentage(
      PriceService.roundToTwoDecimals(data.value)
    );
  }

  sapConditionAmountFormatter(params: ValueFormatterParams): string {
    if (params.data.calculationType === CalculationType.ABSOLUT) {
      return this.numberCurrencyFormatter(params);
    }

    return this.percentageFormatter(params);
  }

  dateFormatter(date: string): string {
    if (!date) {
      return Keyboard.DASH;
    }

    return this.helperService.transformDate(date);
  }

  numberCurrencyFormatter(params: ValueFormatterParams): string {
    return this.helperService.transformNumberCurrency(
      params.value,
      params.context.quotation.currency
    );
  }
}
