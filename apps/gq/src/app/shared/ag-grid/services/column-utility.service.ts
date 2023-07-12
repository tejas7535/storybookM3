/* eslint-disable max-lines */
import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';

import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import {
  CalculationType,
  SalesIndication,
} from '@gq/core/store/reducers/models';
import { ValidationDescription } from '@gq/shared/models/table';
import { MaterialNumberService } from '@gq/shared/services/material-number/material-number.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { parseLocalizedInputValue } from '@gq/shared/utils/misc.utils';
import { roundToTwoDecimals } from '@gq/shared/utils/pricing.utils';
import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import {
  ColDef,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  MenuItemDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { getNumberFilterRegex, LOCALE_DE, LOCALE_EN } from '../../constants';
import { UserRoles } from '../../constants/user-roles.enum';
import { CASE_ORIGIN, Keyboard, Quotation } from '../../models';
import {
  LastCustomerPriceCondition,
  PriceSource,
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '../../models/quotation-detail';
import { GqQuotationPipe } from '../../pipes/gq-quotation/gq-quotation.pipe';
import { MaterialClassificationSOPPipe } from '../../pipes/material-classification-sop/material-classification-sop.pipe';
import { UomPipe } from '../../pipes/uom/uom.pipe';
import {
  CaseTableColumnFields,
  ChinaSpecificColumns,
  ColumnFields,
  GpcColumns,
  SqvColumns,
} from '../constants/column-fields.enum';

type openInTarget = 'window' | 'tab';

@Injectable({
  providedIn: 'root',
})
export class ColumnUtilityService {
  static materialClassificationSOPPipe = new MaterialClassificationSOPPipe();

  constructor(
    private readonly transformationService: TransformationService,
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly materialNumberService: MaterialNumberService
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
        return parseLocalizedInputValue(
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
        ColumnUtilityService.filterSqv(col, roles) &&
        ColumnUtilityService.filterChinaSpecificColumns(col, roles)
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

  static filterChinaSpecificColumns(col: ColDef, roles: string[]): boolean {
    return ChinaSpecificColumns.includes(col.field as ColumnFields)
      ? roles.some((role) =>
          [UserRoles.REGION_GREATER_CHINA, UserRoles.REGION_WORLD].includes(
            role as UserRoles
          )
        )
      : true;
  }

  static filterSAPColumns(
    columnDefs: ColDef[],
    quotation: Quotation
  ): ColDef[] {
    if (
      !quotation.sapId &&
      quotation.sapSyncStatus !== SAP_SYNC_STATUS.SYNC_FAILED
    ) {
      return columnDefs.filter(
        (colDef: ColDef) => colDef.field !== ColumnFields.SAP_STATUS
      );
    }

    return columnDefs;
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

  static getResetAllFilteredColumnsMenuItem(
    params: GetMainMenuItemsParams
  ): MenuItemDef | string {
    return {
      name: translate('shared.customMainMenuItems.resetAllFiltersOfAllColumns'),
      action: () => params.api.setFilterModel({}),
    };
  }

  static getCopyCellContentContextMenuItem(
    params: GetContextMenuItemsParams
  ): MenuItemDef | string {
    return {
      name: translate('shared.customContextMenuItems.copyCellContent'),
      icon: '<span class="ag-icon ag-icon-copy"></span>',
      action: () => getValueOfFocusedCell(params),
    };
  }

  static getOpenInNewWindowContextMenuItem(
    params: GetContextMenuItemsParams
  ): MenuItemDef | string {
    return {
      name: translate('shared.customContextMenuItems.openInNewWindow'),
      action: () => openInNew(params, 'window'),
    };
  }

  static getOpenInNewTabContextMenuItem(
    params: GetContextMenuItemsParams
  ): MenuItemDef | string {
    return {
      name: translate('shared.customContextMenuItems.openInNewTab'),
      action: () => openInNew(params, 'tab'),
    };
  }

  public materialTransform(data: ValueFormatterParams): string {
    return this.materialNumberService.formatStringAsMaterialNumber(data.value);
  }

  public materialGetter(params: ValueGetterParams): string {
    const detail = params.data as QuotationDetail;

    return this.materialNumberService.formatStringAsMaterialNumber(
      detail?.material?.materialNumber15
    );
  }

  filterQuotationStatusColumns(colDef: ColDef, tab: QuotationTab) {
    if (
      tab !== QuotationTab.ACTIVE &&
      colDef.field === CaseTableColumnFields.SAP_SYNC_STATUS
    ) {
      return false;
    }

    return true;
  }

  mapLastUpdateDateOnColumn(colDef: ColDef, activeTab: QuotationTab) {
    if (colDef.field === CaseTableColumnFields.LAST_UPDATED) {
      return {
        ...colDef,
        headerName:
          activeTab === QuotationTab.ARCHIVED
            ? translate('caseView.caseTable.deletedOnDate')
            : translate('caseView.caseTable.lastUpdatedDate'),
      };
    }

    return colDef;
  }

  transformConditionUnit(params: ValueFormatterParams): string {
    const uomPipe = new UomPipe();

    return uomPipe.transform(params.value);
  }

  numberDashFormatter(data: ValueFormatterParams): string {
    if (!data?.value) {
      return Keyboard.DASH;
    }

    return this.transformationService.transformNumber(data.value, false);
  }

  numberFormatter(data: ValueFormatterParams): string {
    return this.transformationService.transformNumber(data.value, false);
  }

  percentageFormatter(data: ValueFormatterParams): string {
    return this.transformationService.transformPercentage(
      roundToTwoDecimals(data.value)
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

    return this.transformationService.transformDate(date);
  }

  caseOriginFormatter(caseOrigin: string): string {
    switch (caseOrigin) {
      case CASE_ORIGIN.SAP_IMPORTED.toString(): {
        return translate('caseView.caseTable.origin.sapImported');
      }
      case CASE_ORIGIN.CREATED_MANUALLY.toString(): {
        return translate('caseView.caseTable.origin.createdManually');
      }
      case CASE_ORIGIN.CREATED_FROM_CUSTOMER.toString(): {
        return translate('caseView.caseTable.origin.createdFromCustomer');
      }
      default: {
        return translate('caseView.caseTable.origin.unknown');
      }
    }
  }

  numberCurrencyFormatter(params: ValueFormatterParams): string {
    return this.transformationService.transformNumberCurrency(
      params.value,
      params.context.quotation.currency
    );
  }

  /**
   * transform a target price that is an optional field
   */
  targetPriceFormatter(params: ValueFormatterParams): string {
    // check for tables where currency is within the data of the row
    if (params.data?.currency) {
      return this.transformationService.transformNumberCurrency(
        params.value,
        params.data.currency
      );
    }

    // currency is not present, but transform the number to locale settings
    return this.transformationService.transformNumber(params.value, true);
  }

  salesIndicationValueGetter(params: ValueGetterParams): string {
    const salesIndicationValue = params.data.salesIndication;
    const salesIndicationTranslationsKeyPath =
      'transactionView.transactions.table.salesIndicationValue';

    switch (salesIndicationValue) {
      case SalesIndication.INVOICE:
        return translate(`${salesIndicationTranslationsKeyPath}.invoice`);
      case SalesIndication.ORDER:
        return translate(`${salesIndicationTranslationsKeyPath}.order`);
      case SalesIndication.LOST_QUOTE:
        return translate(`${salesIndicationTranslationsKeyPath}.lostQuote`);
      default:
        return salesIndicationValue;
    }
  }

  buildMaterialInfoTooltipText(
    description: ValidationDescription[],
    errorCode?: string
  ): string {
    let text = '';

    // show either errorCode Message or DescriptionMessages, No mixes
    if (errorCode) {
      text += `${translate(
        `shared.sapStatusLabels.errorCodes.${errorCode}`
      )}\n`;
    } else {
      description.forEach((item) => {
        text += `${translate(
          `shared.caseMaterial.table.info.status.${item}`
        )}\n`;
      });
    }

    return text;
  }
}

export function getValueOfFocusedCell(params: GetContextMenuItemsParams): void {
  const focusedCell = params.api.getFocusedCell();
  const row = params.api.getDisplayedRowAtIndex(focusedCell.rowIndex);

  const result = params.column.getColDef().valueFormatter
    ? (
        params.column.getColDef().valueFormatter as (
          params: ValueFormatterParams
        ) => string
      )({
        ...params,
        data: params.node.data,
        node: params.node,
        colDef: params.column.getColDef(),
      })
    : params.api.getValue(focusedCell.column, row);

  const clipboard = new Clipboard(document);
  clipboard.copy(result ?? '');
}

export function openInNew(
  params: GetContextMenuItemsParams,
  target: openInTarget
): void {
  const cellRendererInstance: any[] = params.api.getCellRendererInstances({
    rowNodes: [params.node],
    columns: [params.column.getColId()],
  });

  if (cellRendererInstance.length === 0 || !cellRendererInstance[0]['url']) {
    return;
  }

  switch (target) {
    case 'window':
      window.open(
        `${window.location.origin}${cellRendererInstance[0].url}`,
        '_blank',
        'location=no,toolbar=yes'
      );
      break;

    case 'tab':
      window.open(`${window.location.origin}${cellRendererInstance[0].url}`);
      break;

    default:
      break;
  }
}
