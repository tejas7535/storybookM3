import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../feature/sales-planning/model';
import { getDefaultColDef } from '../../../../shared/ag-grid/grid-defaults';
import {
  AgGridFilterType,
  ColumnValueType,
} from '../../../../shared/ag-grid/grid-types';
import { SalesPlanningLevelGroupCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-level-group-cell-renderer.component';

export const getTranslationKey = (
  option: string,
  isMonthly?: boolean
): string =>
  `sales_planning.table.${isMonthly ? 'monthly' : 'yearly'}.${option}`;

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
  default: undefined,
};

interface CustomColumnDefinition {
  key: keyof DetailedCustomerSalesPlan;
  type: ColumnValueType;
}

const initiallyVisibleColumns: CustomColumnDefinition[] = [
  { key: 'totalSalesPlanUnconstrained', type: ColumnValueType.Monetary },
  { key: 'totalSalesPlanAdjusted', type: ColumnValueType.Monetary },
  { key: 'firmBusinessCoverage', type: ColumnValueType.Percentage },
  { key: 'opportunitiesForecastRelevant', type: ColumnValueType.Monetary },
  { key: 'apShareUnconstrained', type: ColumnValueType.Percentage },
  { key: 'spShareUnconstrained', type: ColumnValueType.Percentage },
  { key: 'opShareUnconstrained', type: ColumnValueType.Percentage },
  { key: 'salesDeduction', type: ColumnValueType.Percentage },
  { key: 'cashDiscount', type: ColumnValueType.Percentage },
  { key: 'otherRevenues', type: ColumnValueType.Monetary },
  { key: 'dailyRollingSalesPlanUnconstrained', type: ColumnValueType.Monetary },
];

const unconstrainedColumns: CustomColumnDefinition[] = [
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

const constrainedColumns: CustomColumnDefinition[] = [
  { key: 'totalSalesPlanConstrained', type: ColumnValueType.Monetary },
  { key: 'deliveryBacklog', type: ColumnValueType.Monetary },
  { key: 'orderBookBacklogConstrained', type: ColumnValueType.Monetary },
  {
    key: 'opportunitiesDemandRelevantConstrained',
    type: ColumnValueType.Monetary,
  },
  { key: 'apShareConstrained', type: ColumnValueType.Percentage },
  { key: 'spShareConstrained', type: ColumnValueType.Percentage },
  { key: 'opShareConstrained', type: ColumnValueType.Percentage },
  { key: 'dailyRollingSalesPlanConstrained', type: ColumnValueType.Monetary },
];

export function createAutoGroupColumnDef(locale: string): ColDef {
  return {
    ...getDefaultColDef(locale),
    headerName: translate(getTranslationKey('autoGroupColumn')),
    colId: 'autoGroup',
    sortable: false,
    suppressHeaderFilterButton: false,
    suppressHeaderMenuButton: true,
    minWidth: 400,
    rowGroup: true,
    filter: AgGridFilterType.Text,
    filterValueGetter: (params) => {
      const year = params.data.planningYear;

      if (params.node.level === 0) {
        return year;
      }

      const planningMaterial = params.data.planningMaterial;
      const planningMaterialText = params.data.planningMaterialText;

      return `${planningMaterial} - ${planningMaterialText}`;
    },
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: SalesPlanningLevelGroupCellRendererComponent,
    },
  };
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
  ].map(({ key, type }) => ({
    sortable: false,
    colId: key,
    title: getTranslationKey(key),
    visible: initiallyVisibleColumns.some((col) => col.key === key),
    alwaysVisible: false,

    valueFormatter: valueFormatters[type],
  }));
}
