import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../feature/sales-planning/model';
import { ColumnValueType } from '../../../../shared/ag-grid/grid-types';
import { SalesPlanningAdjustedTotalCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-adjusted-total-cell-renderer/sales-planning-adjusted-total-cell-renderer.component';
import { SalesPlanningOtherRevenuesCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-other-revenues-cell-renderer/sales-planning-other-revenues-cell-renderer.component';
import {
  PercentageEditOption,
  SalesPlanningSinglePercentageEditCellRendererComponent,
} from './ag-grid/cell-renderer/sales-planning-single-percentage-edit-cell-renderer/sales-planning-single-percentage-edit-cell-renderer.component';

const notConfiguredValuePlaceholder = '-';
const sapMagicNumberValueNotConfigured = -1;

export const valueFormatters: any = {
  monetary: (params: any) =>
    params.value === sapMagicNumberValueNotConfigured
      ? notConfiguredValuePlaceholder
      : `${params.context.numberPipe.transform(params.value)} ${params.data?.planningCurrency}`,
  percentage: (params: any) =>
    params.value === sapMagicNumberValueNotConfigured
      ? notConfiguredValuePlaceholder
      : `${params.value} %`,
  months: (params: any) =>
    translate(`sales_planning.table.months.${params.value}`),
  default: undefined,
};

export interface CustomColumnDefinition extends ColDef {
  key: keyof DetailedCustomerSalesPlan;
  type: ColumnValueType;
  isTimeScopeSpecific?: boolean; // defining whether this column is time scope (yearly/monthly) specific
}

export enum TimeScope {
  Yearly = 'yearly',
  Monthly = 'monthly',
}

export const initiallyVisibleColumns: CustomColumnDefinition[] = [
  {
    key: 'totalSalesPlanUnconstrained',
    type: ColumnValueType.Monetary,
    isTimeScopeSpecific: true,
  },
  {
    key: 'totalSalesPlanAdjusted',
    type: ColumnValueType.Monetary,
    isTimeScopeSpecific: true,
    cellRenderer: SalesPlanningAdjustedTotalCellRendererComponent,
  },
  { key: 'firmBusinessCoverage', type: ColumnValueType.Percentage },
  { key: 'opportunitiesForecastRelevant', type: ColumnValueType.Monetary },
  { key: 'apShareUnconstrained', type: ColumnValueType.Percentage },
  { key: 'spShareUnconstrained', type: ColumnValueType.Percentage },
  { key: 'opShareUnconstrained', type: ColumnValueType.Percentage },
  {
    key: 'otherRevenues',
    type: ColumnValueType.Monetary,
    cellRenderer: SalesPlanningOtherRevenuesCellRendererComponent,
  },
  {
    key: 'salesDeduction',
    type: ColumnValueType.Percentage,
    cellRenderer: SalesPlanningSinglePercentageEditCellRendererComponent,
    cellRendererParams: {
      percentageEditOption: PercentageEditOption.SalesDeduction,
      percentageValueName: getTitle('salesDeduction', false, TimeScope.Yearly),
    },
  },
  {
    key: 'cashDiscount',
    type: ColumnValueType.Percentage,
    cellRenderer: SalesPlanningSinglePercentageEditCellRendererComponent,
    cellRendererParams: {
      percentageEditOption: PercentageEditOption.CashDiscount,
      percentageValueName: getTitle('cashDiscount', false, TimeScope.Yearly),
    },
  },
  { key: 'salesPlanUnconstrained', type: ColumnValueType.Monetary },
];

export const unconstrainedColumns: CustomColumnDefinition[] = [
  { key: 'budgetInvoicedSales', type: ColumnValueType.Monetary },
  { key: 'budgetNetSales', type: ColumnValueType.Monetary },
  { key: 'planInvoiceSales', type: ColumnValueType.Monetary },
  { key: 'planNetSales', type: ColumnValueType.Monetary },
  { key: 'firmBusiness', type: ColumnValueType.Monetary },
  { key: 'firmBusinessServices', type: ColumnValueType.Monetary },
  { key: 'orderBookBacklogUnconstrained', type: ColumnValueType.Monetary },
  { key: 'opportunitiesDemandRelevant', type: ColumnValueType.Monetary },
  { key: 'opportunitiesNotSalesPlanRelevant', type: ColumnValueType.Monetary },
  { key: 'plannedValueDemand360', type: ColumnValueType.Monetary },
  { key: 'openPlannedValueDemand360', type: ColumnValueType.Monetary },
  { key: 'apShareAdjustedUnconstrained', type: ColumnValueType.Percentage },
  { key: 'apMaterialDemandPlanCount', type: ColumnValueType.Default },
  { key: 'spShareAdjustedUnconstrained', type: ColumnValueType.Percentage },
  { key: 'spMaterialDemandPlanCount', type: ColumnValueType.Default },
  { key: 'opShareAdjustedUnconstrained', type: ColumnValueType.Percentage },
  { key: 'opMaterialDemandPlanCount', type: ColumnValueType.Default },
];

export const constrainedColumns: CustomColumnDefinition[] = [
  {
    key: 'totalSalesPlanConstrained',
    type: ColumnValueType.Monetary,
    isTimeScopeSpecific: true,
  },
  { key: 'deliveryBacklog', type: ColumnValueType.Monetary },
  { key: 'orderBookBacklogConstrained', type: ColumnValueType.Monetary },
  {
    key: 'opportunitiesDemandRelevantConstrained',
    type: ColumnValueType.Monetary,
  },
  { key: 'apShareConstrained', type: ColumnValueType.Percentage },
  { key: 'spShareConstrained', type: ColumnValueType.Percentage },
  { key: 'opShareConstrained', type: ColumnValueType.Percentage },
  { key: 'salesPlanConstrained', type: ColumnValueType.Monetary },
];

export function getTitle(
  key: string,
  isTimeScopeSpecific: boolean,
  timeScope: TimeScope
) {
  return isTimeScopeSpecific
    ? `${translate(`sales_planning.table.${timeScope}`)} ${translate(`sales_planning.table.${key}`)}`
    : translate(`sales_planning.table.${key}`);
}

export function yearlyCustomerPlanningDetailsColumnDefinitions(): (ColDef & {
  title: string;
  visible: boolean;
  alwaysVisible: boolean;
})[] {
  return [
    ...initiallyVisibleColumns,
    ...unconstrainedColumns,
    ...constrainedColumns,
  ].map((colDef) => ({
    ...colDef,
    sortable: false,
    colId: colDef.key,
    title: getTitle(colDef.key, colDef.isTimeScopeSpecific, TimeScope.Yearly),
    visible: initiallyVisibleColumns.some((col) => col.key === colDef.key),
    alwaysVisible: false,
    valueFormatter: valueFormatters[colDef.type],
  }));
}
