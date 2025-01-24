import { translate } from '@jsverse/transloco';
import { ColDef, ValueFormatterParams } from 'ag-grid-enterprise';

import { materialClassificationOptions } from '../../../../feature/material-customer/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';

export const getAlertTableColumnDefinitions = (
  agGridLocalizationService: AgGridLocalizationService,
  alertTypes: SelectableValue[]
): (ColDef & {
  property: string;
})[] =>
  [
    {
      property: 'customerNumber',
      colId: 'alert.customer_number.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      property: 'customerName',
      colId: 'alert.customer_name.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      property: 'materialNumber',
      colId: 'alert.material_number.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      property: 'materialDescription',
      colId: 'alert.material_description.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      property: 'type',
      colId: 'alert.category.column_header',
      valueFormatter: (params) =>
        params.value
          ? translate(`alert.category.${params.value}`, {})
          : params.value,
      flex: 1,
      minWidth: 200,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: alertTypes.map((item) => item.id),
        valueFormatter: (value: ValueFormatterParams) =>
          translate(`alert.category.${value.value}`),
      },
      sortable: true,
    },
    {
      property: 'materialClassification',
      colId: 'alert.material_classification.column_header',

      filter: 'agSetColumnFilter',
      filterParams: {
        values: materialClassificationOptions,
      },
      sortable: true,
    },
    {
      property: 'customerMaterialNumber',
      colId: 'alert.customer_material_number.column_header',
      cellRenderer: 'customerMaterialNumberCellRenderer',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      property: 'createdAt',
      colId: 'alert.report_date.column_header',
      valueFormatter: agGridLocalizationService.dateFormatter,
      type: 'rightAligned',
      sortable: true,
    },
    {
      property: 'dueDate',
      colId: 'alert.due_date.column_header',
      valueFormatter: agGridLocalizationService.dateFormatter,
      type: 'rightAligned',
      filter: 'agDateColumnFilter',
      sortable: true,
    },
    {
      property: 'comment',
      colId: 'alert.comment.column_header',
      cellRenderer: undefined,
      maxWidth: 375,
      sortable: false,
      tooltipValueGetter: (value) => value,
      tooltipField: 'comment',
    },
    {
      property: 'thresholdDeviation',
      colId: 'alert.thresholdDeviation.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      property: 'threshold1',
      colId: 'alert.threshold1.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      property: 'threshold1Description',
      colId: 'alert.threshold1Description.column_header',
      sortable: false,
    },
    {
      property: 'threshold2',
      colId: 'alert.threshold2.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      property: 'threshold2Description',
      colId: 'alert.threshold2Description.column_header',
      sortable: false,
    },
    {
      property: 'threshold3',
      colId: 'alert.threshold3.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      property: 'threshold3Description',
      colId: 'alert.threshold3Description.column_header',
      sortable: false,
    },
  ] as const;
