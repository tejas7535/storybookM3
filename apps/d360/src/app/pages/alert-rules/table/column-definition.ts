import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
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
  const createColumn = (
    colId: string,
    title: string,
    overrides: Partial<ColDef & { alwaysVisible: boolean }> = {}
  ): ColDef & {
    title: string;
    visible: boolean;
    alwaysVisible: boolean;
  } => ({
    colId,
    title,
    cellRenderer: undefined,
    filter: 'agTextColumnFilter',
    filterParams: undefined,
    visible: true,
    alwaysVisible: false,
    sortable: true,
    sort: null,
    ...overrides,
  });

  return [
    createColumn('region', 'material_customer.column.region'),
    createColumn('salesArea', 'material_customer.column.salesArea'),
    createColumn('salesOrg', 'material_customer.column.salesOrg'),
    createColumn('customerNumber', 'material_customer.column.customerNumber', {
      alwaysVisible: true,
    }),
    createColumn('customerName', 'material_customer.column.customerName'),
    createColumn('materialNumber', 'material_customer.column.materialNumber'),
    createColumn(
      'materialDescription',
      'material_customer.column.materialDescription'
    ),
    createColumn(
      'materialClassification',
      'material_customer.column.materialClassification'
    ),
    createColumn(
      'sectorManagement',
      'material_customer.column.sectorManagement'
    ),
    createColumn('productionLine', 'material_customer.column.productionLine'),
    createColumn('productLine', 'material_customer.column.productLine'),
    createColumn('productionPlant', 'material_customer.column.productionPlant'),
    createColumn(
      'productionSegment',
      'material_customer.column.productionSegment'
    ),
    createColumn('gkamNumber', 'material_customer.column.gkamNumber'),
    createColumn('gkamName', 'material_customer.column.gkamName'),
    createColumn('demandPlanner', 'material_customer.column.demandPlanner'),
    createColumn('alertComment', 'alert_rules.edit_modal.label.remark', {
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
    }),
    createColumn('threshold1', 'rules.threshold1', {
      filter: 'agNumberColumnFilter',
      valueFormatter: agGridLocalizationService.numberFormatter,
    }),
    createColumn('threshold1Description', 'rules.threshold1Description', {
      filter: undefined,
      sortable: false,
    }),
    createColumn('threshold2', 'rules.threshold2', {
      filter: 'agNumberColumnFilter',
      valueFormatter: agGridLocalizationService.numberFormatter,
    }),
    createColumn('threshold2Description', 'rules.threshold2Description', {
      filter: undefined,
      sortable: false,
    }),
    createColumn('threshold3', 'rules.threshold3', {
      filter: 'agNumberColumnFilter',
      valueFormatter: agGridLocalizationService.numberFormatter,
    }),
    createColumn('threshold3Description', 'rules.threshold3Description', {
      filter: undefined,
      sortable: false,
    }),
    createColumn('startDate', 'rules.startDate', {
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterCellValueComparator },
    }),
    createColumn('execDay', 'rules.execDay', {
      valueFormatter: (params: ValueFormatterParams) =>
        translate(`alert_rules.edit_modal.label.when.${params.value}`),
    }),
    createColumn('execInterval', 'rules.execInterval', {
      valueFormatter: (params: ValueFormatterParams) =>
        translate(`alert_rules.edit_modal.label.interval.${params.value}`),
    }),
    createColumn('endDate', 'rules.endDate', {
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterCellValueComparator },
    }),
    createColumn('deactivated', 'rules.deactivated', {
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
    }),
    createColumn('activeCount', 'rules.activeCount', {
      filter: 'agNumberColumnFilter',
    }),
    createColumn('inactiveCount', 'rules.inactiveCount', {
      filter: 'agNumberColumnFilter',
    }),
    createColumn('completedCount', 'rules.completedCount', {
      filter: 'agNumberColumnFilter',
    }),
    createColumn('usernameCreated', 'alert_rules.table.column.usernameCreated'),
    createColumn(
      'usernameLastChanged',
      'alert_rules.table.column.usernameLastChanged'
    ),
  ] as const;
}
