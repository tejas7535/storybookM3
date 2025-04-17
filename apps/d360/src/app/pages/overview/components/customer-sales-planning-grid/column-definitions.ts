import {
  ColDef,
  ITooltipParams,
  ValueFormatterParams,
} from 'ag-grid-enterprise';

import { ValueBadgeCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/value-badge-cell-renderer/value-badge-cell-renderer.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { CustomerSalesPlanningLayout } from '../../overview.component';
import { CustomerSalesPlanningData } from './customer-sales-planning-grid.component';

export const moneyFormatter = (
  params:
    | ValueFormatterParams<CustomerSalesPlanningData, number>
    | ITooltipParams<CustomerSalesPlanningData, number>,
  agGridLocalizationService: AgGridLocalizationService
): string => {
  const formattedNumber = agGridLocalizationService.numberFormatter(params, 0);

  return formattedNumber
    ? `${formattedNumber} ${params.data?.currency || ''}`.trim()
    : '';
};
export const percentageFormatter = (
  params:
    | ValueFormatterParams<CustomerSalesPlanningData, number>
    | ITooltipParams<CustomerSalesPlanningData, number>,
  agGridLocalizationService: AgGridLocalizationService
): string => {
  const formattedNumber = agGridLocalizationService.numberFormatter(params, 0);

  return formattedNumber ? `${formattedNumber} %`.trim() : '';
};

export const getColumnDefs: (
  agGridLocalizationService: AgGridLocalizationService,
  layout: CustomerSalesPlanningLayout
) => (ColDef & {
  layout?: CustomerSalesPlanningLayout[];
  title: string;
  visible: boolean;
  alwaysVisible: boolean;
})[] = (
  agGridLocalizationService: AgGridLocalizationService,
  layout: CustomerSalesPlanningLayout
) =>
  [
    {
      title: 'customerNumber',
      visible: false,
      floatingFilter: false,
      alwaysVisible: true,
      field: 'customerNumber',
      tooltipField: 'customerNumber',
      colId: 'customerNumber',
      flex: 1,
      minWidth: 100,
      layout: [
        CustomerSalesPlanningLayout.PreviousToCurrent,
        CustomerSalesPlanningLayout.CurrentToNext,
      ],
    },
    {
      title: 'customerName',
      visible: false,
      floatingFilter: false,
      alwaysVisible: true,
      field: 'customerName',
      tooltipField: 'customerName',
      colId: 'customerName',
      flex: 1,
      minWidth: 100,
      layout: [
        CustomerSalesPlanningLayout.PreviousToCurrent,
        CustomerSalesPlanningLayout.CurrentToNext,
      ],
    },
    {
      title: 'firmBusinessPreviousYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'firmBusinessPreviousYear',
      colId: 'firmBusinessPreviousYear',
      minWidth: 100,
      width: 100,
      layout: [CustomerSalesPlanningLayout.PreviousToCurrent],
      tooltipValueGetter: (params: ITooltipParams) =>
        moneyFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        moneyFormatter(params, agGridLocalizationService),
    },
    {
      title: 'yearlyTotalCurrentYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'yearlyTotalCurrentYear',
      colId: 'yearlyTotalCurrentYear',
      minWidth: 100,
      width: 100,
      layout: [
        CustomerSalesPlanningLayout.PreviousToCurrent,
        CustomerSalesPlanningLayout.CurrentToNext,
      ],
      tooltipValueGetter: (params: ITooltipParams) =>
        moneyFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        moneyFormatter(params, agGridLocalizationService),
    },
    {
      title: 'firmBusinessCurrentYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'firmBusinessCurrentYear',
      colId: 'firmBusinessCurrentYear',
      minWidth: 100,
      width: 100,
      layout: [
        CustomerSalesPlanningLayout.PreviousToCurrent,
        CustomerSalesPlanningLayout.CurrentToNext,
      ],
      tooltipValueGetter: (params: ITooltipParams) =>
        moneyFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        moneyFormatter(params, agGridLocalizationService),
    },
    {
      title: 'deviationToPreviousYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'deviationToPreviousYear',
      colId: 'deviationToPreviousYear',
      layout: [CustomerSalesPlanningLayout.PreviousToCurrent],
      cellRenderer: ValueBadgeCellRendererComponent,
      minWidth: 75,
      width: 75,
      tooltipValueGetter: (params: ITooltipParams) =>
        percentageFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        percentageFormatter(params, agGridLocalizationService),
    },
    {
      title: 'salesPlannedCurrentYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'salesPlannedCurrentYear',
      colId: 'salesPlannedCurrentYear',
      layout: [CustomerSalesPlanningLayout.PreviousToCurrent],
      cellRenderer: ValueBadgeCellRendererComponent,
      minWidth: 75,
      width: 75,
      tooltipValueGetter: (params: ITooltipParams) =>
        percentageFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        percentageFormatter(params, agGridLocalizationService),
    },
    {
      title: 'demandPlannedCurrentYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'demandPlannedCurrentYear',
      colId: 'demandPlannedCurrentYear',
      layout: [CustomerSalesPlanningLayout.PreviousToCurrent],
      cellRenderer: ValueBadgeCellRendererComponent,
      minWidth: 75,
      width: 75,
      tooltipValueGetter: (params: ITooltipParams) =>
        percentageFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        percentageFormatter(params, agGridLocalizationService),
    },
    {
      title: 'yearlyTotalNextYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'yearlyTotalNextYear',
      colId: 'yearlyTotalNextYear',
      minWidth: 100,
      width: 100,
      layout: [CustomerSalesPlanningLayout.CurrentToNext],
      tooltipValueGetter: (params: ITooltipParams) =>
        moneyFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        moneyFormatter(params, agGridLocalizationService),
    },
    {
      title: 'firmBusinessNextYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'firmBusinessNextYear',
      colId: 'firmBusinessNextYear',
      minWidth: 100,
      width: 100,
      layout: [CustomerSalesPlanningLayout.CurrentToNext],
      tooltipValueGetter: (params: ITooltipParams) =>
        moneyFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        moneyFormatter(params, agGridLocalizationService),
    },
    {
      title: 'deviationToCurrentYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'deviationToCurrentYear',
      colId: 'deviationToCurrentYear',
      layout: [CustomerSalesPlanningLayout.CurrentToNext],
      cellRenderer: ValueBadgeCellRendererComponent,
      minWidth: 75,
      width: 75,
      tooltipValueGetter: (params: ITooltipParams) =>
        percentageFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        percentageFormatter(params, agGridLocalizationService),
    },
    {
      title: 'salesPlannedNextYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'salesPlannedNextYear',
      colId: 'salesPlannedNextYear',
      layout: [CustomerSalesPlanningLayout.CurrentToNext],
      cellRenderer: ValueBadgeCellRendererComponent,
      minWidth: 75,
      width: 75,
      tooltipValueGetter: (params: ITooltipParams) =>
        percentageFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        percentageFormatter(params, agGridLocalizationService),
    },
    {
      title: 'demandPlannedNextYear',
      visible: false,
      floatingFilter: false,
      filter: 'agNumberColumnFilter',
      alwaysVisible: false,
      field: 'demandPlannedNextYear',
      colId: 'demandPlannedNextYear',
      layout: [CustomerSalesPlanningLayout.CurrentToNext],
      cellRenderer: ValueBadgeCellRendererComponent,
      minWidth: 75,
      width: 75,
      tooltipValueGetter: (params: ITooltipParams) =>
        percentageFormatter(params, agGridLocalizationService),
      valueFormatter: (params: ValueFormatterParams) =>
        percentageFormatter(params, agGridLocalizationService),
    },
    {
      title: 'lastPlannedBy',
      visible: false,
      floatingFilter: false,
      filter: 'agTextColumnFilter',
      alwaysVisible: false,
      field: 'lastPlannedBy',
      colId: 'lastPlannedBy',
      tooltipField: 'lastPlannedBy',
    },
    {
      title: 'lastChangeDate',
      visible: false,
      floatingFilter: false,
      filter: 'agDateColumnFilter',
      alwaysVisible: false,
      field: 'lastChangeDate',
      colId: 'lastChangeDate',
      tooltipField: 'lastChangeDate',
      valueFormatter: agGridLocalizationService.dateFormatter,
    },
  ].map((column) => {
    const isVisible = column.layout?.includes(layout);

    return { ...column, visible: isVisible, hide: !isVisible };
  });
