import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { parseISO } from 'date-fns';

import { GridTooltipComponent } from '../../../shared/components/ag-grid/grid-tooltip/grid-tooltip.component';
import { AgGridLocalizationService } from '../../../shared/services/ag-grid-localization.service';

export const dateFilterCellValueComparator = (
  filterLocalDateAtMidnight: Date,
  cellValue: any
) => {
  const dateAsString = cellValue;

  if (dateAsString === null) {
    return 0;
  }

  const cellDate = parseISO(dateAsString);

  if (cellDate < filterLocalDateAtMidnight) {
    return -1;
  } else if (cellDate > filterLocalDateAtMidnight) {
    return 1;
  }

  return 0;
};

export function alertRuleColumnDefinitions(
  agGridLocalizationService: AgGridLocalizationService
): (ColDef & {
  title: string;
  visible: boolean;
  alwaysVisible: boolean;
})[] {
  const getDefaultColumn = (): ColDef & {
    title: string;
    visible: boolean;
    alwaysVisible: boolean;
  } => ({
    cellRenderer: undefined,
    filter: 'agTextColumnFilter',
    filterParams: undefined,
    visible: true,
    alwaysVisible: false,
    sortable: true,
    sort: null,
    title: '',
  });

  return [
    {
      ...getDefaultColumn(),
      colId: 'region',
      title: 'material_customer.column.region',
    },
    {
      ...getDefaultColumn(),
      colId: 'salesArea',
      title: 'material_customer.column.salesArea',
    },
    {
      ...getDefaultColumn(),
      colId: 'salesOrg',
      title: 'material_customer.column.salesOrg',
    },
    {
      ...getDefaultColumn(),
      colId: 'customerNumber',
      title: 'material_customer.column.customerNumber',
      alwaysVisible: true,
    },
    {
      ...getDefaultColumn(),
      colId: 'customerName',
      title: 'material_customer.column.customerName',
    },
    {
      ...getDefaultColumn(),
      colId: 'materialNumber',
      title: 'material_customer.column.materialNumber',
    },
    {
      ...getDefaultColumn(),
      colId: 'materialDescription',
      title: 'material_customer.column.materialDescription',
    },
    {
      ...getDefaultColumn(),
      colId: 'materialClassification',
      title: 'material_customer.column.materialClassification',
    },
    {
      ...getDefaultColumn(),
      colId: 'sectorManagement',
      title: 'material_customer.column.sectorManagement',
    },
    {
      ...getDefaultColumn(),
      colId: 'productionLine',
      title: 'material_customer.column.productionLine',
    },
    {
      ...getDefaultColumn(),
      colId: 'productLine',
      title: 'material_customer.column.productLine',
    },
    {
      ...getDefaultColumn(),
      colId: 'gkamNumber',
      title: 'material_customer.column.gkamNumber',
    },
    {
      ...getDefaultColumn(),
      colId: 'gkamName',
      title: 'material_customer.column.gkamName',
    },
    {
      ...getDefaultColumn(),
      colId: 'demandPlanner',
      title: 'material_customer.column.demandPlanner',
    },
    {
      ...getDefaultColumn(),
      colId: 'alertComment',
      title: 'alert_rules.edit_modal.label.comment',
      filter: undefined,
      sortable: false,
      maxWidth: 375,
      tooltipComponent: GridTooltipComponent,
      tooltipField: 'alertComment',
      tooltipComponentParams: {
        wide: true,
        lineBreaks: true,
        textLeft: true,
      },
    },
    {
      ...getDefaultColumn(),
      colId: 'threshold1',
      title: 'rules.threshold1',
      filter: 'agNumberColumnFilter',
      valueFormatter: agGridLocalizationService.numberFormatter,
    },
    {
      ...getDefaultColumn(),
      colId: 'threshold1Description',
      title: 'rules.threshold1Description',
      filter: undefined,
      sortable: false,
    },
    {
      ...getDefaultColumn(),
      colId: 'threshold2',
      title: 'rules.threshold2',
      filter: 'agNumberColumnFilter',
      valueFormatter: agGridLocalizationService.numberFormatter,
    },
    {
      ...getDefaultColumn(),
      colId: 'threshold2Description',
      title: 'rules.threshold2Description',
      filter: undefined,
      sortable: false,
    },
    {
      ...getDefaultColumn(),
      colId: 'threshold3',
      title: 'rules.threshold3',
      filter: 'agNumberColumnFilter',
      valueFormatter: agGridLocalizationService.numberFormatter,
    },
    {
      ...getDefaultColumn(),
      colId: 'threshold3Description',
      title: 'rules.threshold3Description',
      filter: undefined,
      sortable: false,
    },
    {
      ...getDefaultColumn(),
      colId: 'startDate',
      title: 'rules.startDate',
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterCellValueComparator },
    },
    {
      ...getDefaultColumn(),
      colId: 'execDay',
      title: 'rules.execDay',
      valueFormatter: (params: ValueFormatterParams) =>
        translate(`alert_rules.edit_modal.label.when.${params.value}`),
    },
    {
      ...getDefaultColumn(),
      colId: 'execInterval',
      title: 'rules.execInterval',
      valueFormatter: (params: ValueFormatterParams) =>
        translate(`alert_rules.edit_modal.label.interval.${params.value}`),
    },
    {
      ...getDefaultColumn(),
      colId: 'endDate',
      title: 'rules.endDate',
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterCellValueComparator },
    },
    {
      ...getDefaultColumn(),
      colId: 'deactivated',
      title: 'rules.deactivated',
      // Hint: We can't use valueFormatter here, because AG-Grid knowns, that this column contains a boolean.
      cellRenderer: (params: ICellRendererParams) =>
        translate(`alert_rules.table.deactivated.${params.value}`),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [true, false],
        valueFormatter: (params: ValueFormatterParams) =>
          translate(`alert_rules.table.deactivated.${params.value}`),
      },
      alwaysVisible: true,
    },
    {
      ...getDefaultColumn(),
      colId: 'activeCount',
      title: 'rules.activeCount',
      filter: 'agNumberColumnFilter',
    },
    {
      ...getDefaultColumn(),
      colId: 'inactiveCount',
      title: 'rules.inactiveCount',
      filter: 'agNumberColumnFilter',
    },
    {
      ...getDefaultColumn(),
      colId: 'completedCount',
      title: 'rules.completedCount',
      filter: 'agNumberColumnFilter',
    },
    {
      ...getDefaultColumn(),
      colId: 'usernameCreated',
      title: 'alert_rules.table.column.usernameCreated',
    },
    {
      ...getDefaultColumn(),
      colId: 'usernameLastChanged',
      title: 'alert_rules.table.column.usernameLastChanged',
    },
  ] as const;
}
