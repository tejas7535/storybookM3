/* eslint-disable max-lines */
import { Clipboard } from '@angular/cdk/clipboard';
import { inject, Injectable } from '@angular/core';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import {
  CalculationType,
  SalesIndication,
} from '@gq/core/store/reducers/models';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { QuotationStatus } from '@gq/shared/models/quotation';
import { ValidationDescription } from '@gq/shared/models/table';
import { MaterialNumberService } from '@gq/shared/services/material-number/material-number.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { parseLocalizedInputValue } from '@gq/shared/utils/misc.utils';
import {
  roundPercentageToTwoDecimals,
  roundToFourDecimals,
} from '@gq/shared/utils/pricing.utils';
import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
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
import {
  CASE_ORIGIN,
  Keyboard,
  Quotation,
  SAP_SYNC_STATUS,
} from '../../models';
import {
  LastCustomerPriceCondition,
  PriceSource,
  QuotationDetail,
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
        inputText = text.replaceAll(',', Keyboard.DOT);
      }

      return Number.parseFloat(inputText);
    },
  };

  private readonly transformationService = inject(TransformationService);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly materialNumberService = inject(MaterialNumberService);
  private readonly clipboard = inject(Clipboard);

  getCopyCellContentContextMenuItem(
    params: GetContextMenuItemsParams
  ): MenuItemDef | string {
    return {
      name: translate('shared.customContextMenuItems.copyCellContent'),
      icon: '<span class="ag-icon ag-icon-copy"></span>',
      action: () => this.getValueOfFocusedCell(params),
    };
  }

  getValueOfFocusedCell(params: GetContextMenuItemsParams): void {
    const focusedCell = params.api.getFocusedCell();

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
      : params.api.getCellValue({
          rowNode: params.node,
          colKey: focusedCell.column.getColId(),
        });

    this.clipboard.copy(result ?? '');
  }
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
        (colDef: ColDef) => colDef.field !== ColumnFields.SAP_SYNC_STATUS
      );
    }

    return columnDefs;
  }

  static filterPricingAssistantColumns(columnDefs: ColDef[]): ColDef[] {
    return columnDefs.filter(
      (colDef: ColDef) => colDef.field !== ColumnFields.PRICING_ASSISTANT
    );
  }

  static filterRfqColumns(columnDefs: ColDef[]): ColDef[] {
    return columnDefs.filter(
      (colDef: ColDef) =>
        colDef.field !== ColumnFields.SQV_RFQ &&
        colDef.field !== ColumnFields.GPM_RFQ
    );
  }

  static filterSapPriceDiffColumn(columnDefs: ColDef[]): ColDef[] {
    return columnDefs.filter(
      (colDef) => colDef.field !== ColumnFields.PRICE_DIFF_SAP
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

  /**
   * Comparator for sorting as string formatted number values
   * e.g. percentage Values
   */
  static numberAsStringComparator(valueA: string, valueB: string): number {
    if (!Number(valueA) && !Number(valueB)) {
      return 0;
    }
    if (!Number(valueA)) {
      return -1;
    }
    if (!Number(valueB)) {
      return 1;
    }

    return Number(valueA) - Number(valueB);
  }
  static basicTransform(data: ValueFormatterParams): string {
    return data.value || Keyboard.DASH;
  }
  static blankTransform(data: ValueFormatterParams): string {
    return data.value || '';
  }
  static hashTransform(data: ValueFormatterParams): string {
    if (data?.value === Keyboard.HASH) {
      return Keyboard.DASH;
    }

    return ColumnUtilityService.basicTransform(data);
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
      : translate('shared.quotationDetailsTable.priceSourceLabel', {
          priceSource: data.value,
        });
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

  static getOpenInNewWindowContextMenuItemByUrl(
    url: string
  ): MenuItemDef | string {
    return {
      name: translate('shared.customContextMenuItems.openInNewWindow'),
      action: () => openInNewByUrl(url, 'window'),
    };
  }

  static getOpenInNewTabContextMenuItemByUrl(
    url: string
  ): MenuItemDef | string {
    return {
      name: translate('shared.customContextMenuItems.openInNewTab'),
      action: () => openInNewByUrl(url, 'tab'),
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

  getMspBlock(params: ValueGetterParams): string {
    const detail = params.data as QuotationDetail;

    if (detail.price < detail.msp) {
      return translate('shared.quotationDetailsTable.mspBlock.active');
    }

    return Keyboard.DASH;
  }

  filterSapSyncStatusColumns(colDef: ColDef, tab: QuotationTab) {
    if (
      tab !== QuotationTab.ACTIVE &&
      colDef.field === CaseTableColumnFields.SAP_SYNC_STATUS
    ) {
      return false;
    }

    return true;
  }

  filterQuotationStatusColumns(colDef: ColDef, tab: QuotationTab): boolean {
    if (
      tab !== QuotationTab.TO_APPROVE &&
      tab !== QuotationTab.IN_APPROVAL &&
      tab !== QuotationTab.APPROVED &&
      tab !== QuotationTab.REJECTED &&
      colDef.field === CaseTableColumnFields.STATUS
    ) {
      return false;
    }

    return true;
  }

  filterSharedQuotationsColumns(colDef: ColDef, tab: QuotationTab): boolean {
    if (
      tab !== QuotationTab.SHARED &&
      colDef.field === CaseTableColumnFields.GQ_CREATED_BY
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

  numberFilteringFormatter(value: number): number | undefined {
    if (!value) {
      return undefined;
    }

    return value;
  }

  percentageFormatter(
    data: ValueFormatterParams,
    isPercentageFormat: boolean = true,
    keepZeroValue: boolean = false
  ): string {
    const value = data.value === null ? null : roundToFourDecimals(data.value);

    return this.transformationService.transformPercentage(
      value,
      isPercentageFormat,
      keepZeroValue
    );
  }

  uomFormatter(data: ValueFormatterParams, uom: string): string {
    if (!data?.value) {
      return this.numberDashFormatter(data?.value);
    }

    const uomPipe = new UomPipe();

    return `${data.value}  ${uomPipe.transform(uom)}`;
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

  dateFilteringFormatter(date: string): string | undefined {
    if (!date) {
      return undefined;
    }

    return this.transformationService.transformDate(date);
  }

  caseOriginFormatter(caseOrigin: number): string {
    switch (caseOrigin) {
      case CASE_ORIGIN.SAP_IMPORTED: {
        return translate('caseView.caseTable.origin.sapImported');
      }
      case CASE_ORIGIN.CREATED_MANUALLY: {
        return translate('caseView.caseTable.origin.createdManually');
      }
      case CASE_ORIGIN.CREATED_FROM_CUSTOMER: {
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
      case SalesIndication.INVOICE: {
        return translate(`${salesIndicationTranslationsKeyPath}.invoice`);
      }
      case SalesIndication.ORDER: {
        return translate(`${salesIndicationTranslationsKeyPath}.order`);
      }
      case SalesIndication.LOST_QUOTE: {
        return translate(`${salesIndicationTranslationsKeyPath}.lostQuote`);
      }
      default: {
        return salesIndicationValue;
      }
    }
  }

  buildMaterialInfoText(
    description: ValidationDescription[],
    errorCodes?: string[]
  ): string {
    let text = '';

    // show either errorCode Message or DescriptionMessages, No mixes
    if (errorCodes?.length > 0) {
      errorCodes.forEach((item) => {
        text += `${translate(`shared.sapStatusLabels.errorCodes.${item}`)}\n`;
      });
    } else {
      description.forEach((item) => {
        text += `${translate(
          `shared.caseMaterial.table.info.status.${item}`
        )}\n`;
      });
    }

    return text;
  }

  /**
   * Determine tha navigation path to be used to navigate from Case-View to Process-Case-View.
   *
   * @param quotation The quotation status
   * @returns The parts of the navigation path as an array
   */
  determineCaseNavigationPath(
    quotationStatus: QuotationStatus,
    enabledForApprovalWorkflow: boolean
  ) {
    return enabledForApprovalWorkflow &&
      (quotationStatus === QuotationStatus.IN_APPROVAL ||
        quotationStatus === QuotationStatus.APPROVED ||
        quotationStatus === QuotationStatus.REJECTED)
      ? [AppRoutePath.ProcessCaseViewPath, ProcessCaseRoutePath.OverviewPath]
      : [AppRoutePath.ProcessCaseViewPath];
  }

  getPercentageFilterValue(value: number): number {
    // In AG Grid filtering 0 value is not considered as "blank". So we need to return null for 0 value.
    if (!value) {
      return null;
    }

    return roundPercentageToTwoDecimals(value);
  }
}

/**
 * open the case in new window or tab.
 * To be used when row/cell has gqIdComponent as cellRenderer
 * @param params contextMenuParams
 * @param target open in Window or Tab
 * @returns
 */
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
  const url = `${window.location.origin}${cellRendererInstance[0].url}`;
  openInNewByUrl(url, target);
}

/**
 * open a url in new window or tab
 * @param target open in window or tab
 * @param url url to open
 */
export const openInNewByUrl = (url: string, target: openInTarget) => {
  switch (target) {
    case 'window': {
      window.open(`${url}`, '_blank', 'location=no,toolbar=yes');
      break;
    }

    case 'tab': {
      window.open(`${url}`);
      break;
    }

    default: {
      break;
    }
  }
};
