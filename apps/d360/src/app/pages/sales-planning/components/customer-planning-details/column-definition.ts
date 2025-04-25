import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../feature/sales-planning/model';
import { ColumnValueType } from '../../../../shared/ag-grid/grid-types';
import { SalesPlanningAdjustedTotalCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-adjusted-total-cell-renderer/sales-planning-adjusted-total-cell-renderer.component';
import { SalesPlanningOtherRevenuesCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-other-revenues-cell-renderer/sales-planning-other-revenues-cell-renderer.component';
import { SalesPlanningShareEditCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-share-edit-cell-renderer/sales-planning-share-edit-cell-renderer.component';
import {
  PercentageEditOption,
  SalesPlanningSinglePercentageEditCellRendererComponent,
} from './ag-grid/cell-renderer/sales-planning-single-percentage-edit-cell-renderer/sales-planning-single-percentage-edit-cell-renderer.component';
import { SalesPlanningSyncCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-sync-cell-renderer/sales-planning-sync-cell-renderer.component';

const notConfiguredValuePlaceholder = '-';
export const sapMagicNumberValueNotConfigured = -1;

export const valueFormatters: Record<
  ColumnValueType,
  ((params: any) => string | undefined) | undefined
> = {
  [ColumnValueType.Monetary]: (params: any) =>
    params.value === sapMagicNumberValueNotConfigured
      ? notConfiguredValuePlaceholder
      : `${params.context.numberPipe.transform(params.value)} ${params.data?.planningCurrency}`,
  [ColumnValueType.Percentage]: (params: any) =>
    params.value === sapMagicNumberValueNotConfigured
      ? notConfiguredValuePlaceholder
      : `${params.value} %`,
  [ColumnValueType.Months]: (params: any) =>
    translate(`sales_planning.table.months.${params.value}`),
  [ColumnValueType.Default]: undefined,
};

export interface CustomColumnDefinition extends ColDef {
  key: keyof DetailedCustomerSalesPlan;
  type: ColumnValueType;
  title?: string;
  visible?: boolean;
  alwaysVisible?: boolean;
  filterModel?: any;
  isTimeScopeSpecific?: boolean; // defining whether this column is time scope (yearly/monthly) specific
}

export enum TimeScope {
  Yearly = 'yearly',
  Monthly = 'monthly',
}

export const initiallyVisibleColumns: {
  [TimeScope.Yearly]: (keyof DetailedCustomerSalesPlan)[];
  [TimeScope.Monthly]: (keyof DetailedCustomerSalesPlan)[];
} = {
  [TimeScope.Yearly]: [
    'totalSalesPlanConstrained',
    'totalSalesPlanUnconstrained',
    'totalSalesPlanAdjusted',
    'budgetInvoicedSales',
    'firmBusinessCoverage',
    'openPlannedValueDemand360',
    'salesDeduction',
    'cashDiscount',
    'otherRevenues',
    'salesPlanUnconstrained',
    'salesPlanConstrained',
    'opportunitiesTotal',
  ],
  [TimeScope.Monthly]: [
    'planningMonth',
    'totalSalesPlanConstrained',
    'totalSalesPlanUnconstrained',
    'totalSalesPlanAdjusted',
    'budgetInvoicedSales',
    'firmBusinessCoverage',
    'openPlannedValueDemand360',
    'salesPlanConstrained',
    'opportunitiesTotal',
  ],
};

export function getTitle(
  key: string,
  isTimeScopeSpecific: boolean,
  timeScope: TimeScope
) {
  const titles: string[] = [];

  if (isTimeScopeSpecific) {
    titles.push(translate(`sales_planning.table.${timeScope}`));
  }

  titles.push(translate(`sales_planning.table.${key}`));

  return titles.join(' ');
}

export function getColumnDefinitions(scope: TimeScope): (ColDef & {
  title: string;
  visible: boolean;
  alwaysVisible: boolean;
})[] {
  const getDefaults = (
    colDef: CustomColumnDefinition
  ): CustomColumnDefinition => ({
    ...colDef,
    title: getTitle(colDef.key, colDef.isTimeScopeSpecific, scope),
    sortable: false,
    colId: colDef.key,
    alwaysVisible: false,
    visible: initiallyVisibleColumns[scope].includes(colDef.key),
    valueFormatter: valueFormatters[colDef.type],
  });

  return [
    ...(scope === TimeScope.Monthly
      ? [getDefaults({ key: 'planningMonth', type: ColumnValueType.Months })]
      : []),
    getDefaults({ key: 'budgetNetSales', type: ColumnValueType.Monetary }),
    getDefaults({ key: 'budgetInvoicedSales', type: ColumnValueType.Monetary }),
    getDefaults({ key: 'planNetSales', type: ColumnValueType.Monetary }),
    getDefaults({ key: 'planInvoiceSales', type: ColumnValueType.Monetary }),
    getDefaults({
      key: 'totalSalesPlanUnconstrained',
      type: ColumnValueType.Monetary,
      isTimeScopeSpecific: true,
      cellRenderer: SalesPlanningSyncCellRendererComponent,
    }),
    getDefaults({
      key: 'totalSalesPlanAdjusted',
      type: ColumnValueType.Monetary,
      isTimeScopeSpecific: true,
      cellRenderer: SalesPlanningAdjustedTotalCellRendererComponent,
      cellRendererParams: { scope },
    }),
    getDefaults({ key: 'addOneOriginalValue', type: ColumnValueType.Monetary }),
    getDefaults({
      key: 'firmBusinessCoverage',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({ key: 'firmBusiness', type: ColumnValueType.Monetary }),
    getDefaults({
      key: 'firmBusinessServices',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({ key: 'opportunitiesTotal', type: ColumnValueType.Monetary }),
    getDefaults({
      key: 'opportunitiesDemandRelevant',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'opportunitiesForecastRelevant',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'plannedValueDemand360',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'openPlannedValueDemand360',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'apShareOriginalUnconstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'apShareUnconstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'apMaterialDemandPlanCount',
      type: ColumnValueType.Default,
    }),
    getDefaults({
      key: 'spShareOriginalUnconstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'spShareUnconstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'spMaterialDemandPlanCount',
      type: ColumnValueType.Default,
    }),
    getDefaults({
      key: 'opShareOriginalUnconstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'opShareUnconstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'opMaterialDemandPlanCount',
      type: ColumnValueType.Default,
    }),
    getDefaults({
      key: 'salesDeduction',
      type: ColumnValueType.Percentage,
      ...(scope === TimeScope.Yearly
        ? {
            cellRenderer:
              SalesPlanningSinglePercentageEditCellRendererComponent,
            cellRendererParams: {
              percentageEditOption: PercentageEditOption.SalesDeduction,
              percentageValueName: getTitle(
                'salesDeduction',
                false,
                TimeScope.Yearly
              ),
            },
          }
        : {}),
    }),
    getDefaults({
      key: 'cashDiscount',
      type: ColumnValueType.Percentage,
      ...(scope === TimeScope.Yearly
        ? {
            cellRenderer:
              SalesPlanningSinglePercentageEditCellRendererComponent,
            cellRendererParams: {
              percentageEditOption: PercentageEditOption.CashDiscount,
              percentageValueName: getTitle(
                'cashDiscount',
                false,
                TimeScope.Yearly
              ),
            },
          }
        : {}),
    }),
    getDefaults({
      key: 'otherRevenues',
      type: ColumnValueType.Monetary,
      ...(scope === TimeScope.Yearly
        ? { cellRenderer: SalesPlanningOtherRevenuesCellRendererComponent }
        : {}),
    }),
    getDefaults({
      key: 'salesPlanUnconstrained',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'totalSalesPlanConstrained',
      type: ColumnValueType.Monetary,
      isTimeScopeSpecific: true,
    }),
    getDefaults({
      key: 'deliveriesAcrossYears',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'ordersAcrossYearsFuture',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'ordersAcrossYearsPast',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'opportunitiesDemandRelevantConstrained',
      type: ColumnValueType.Monetary,
    }),
    getDefaults({
      key: 'apShareConstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'spShareConstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'opShareConstrained',
      type: ColumnValueType.Percentage,
    }),
    getDefaults({
      key: 'salesPlanConstrained',
      type: ColumnValueType.Monetary,
    }),

    // Hint: These 3 columns are implemented with D360-193 and was removed in D360-321, because they are not fully implemented by the backend yet
    // eslint-disable-next-line no-constant-condition
    ...(false
      ? [
          getDefaults({
            key: 'apShareAdjustedUnconstrained',
            type: ColumnValueType.Percentage,
            ...(scope === TimeScope.Yearly
              ? { cellRenderer: SalesPlanningShareEditCellRendererComponent }
              : {}),
          }),
          getDefaults({
            key: 'spShareAdjustedUnconstrained',
            type: ColumnValueType.Percentage,
            ...(scope === TimeScope.Yearly
              ? { cellRenderer: SalesPlanningShareEditCellRendererComponent }
              : {}),
          }),
          getDefaults({
            key: 'opShareAdjustedUnconstrained',
            type: ColumnValueType.Percentage,
            ...(scope === TimeScope.Yearly
              ? { cellRenderer: SalesPlanningShareEditCellRendererComponent }
              : {}),
          }),
        ]
      : []),
  ] as unknown as (ColDef & {
    title: string;
    visible: boolean;
    alwaysVisible: boolean;
  })[];
}
