import { translate } from '@jsverse/transloco';
import { ColDef, ValueFormatterParams } from 'ag-grid-enterprise';

import { Alert } from '../../../../feature/alerts/model';
import { materialClassificationOptions } from '../../../../feature/material-customer/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';

export const getAlertTableColumnDefinitions = (
  agGridLocalizationService: AgGridLocalizationService,
  alertTypes: SelectableValue[]
): ColDef<Alert>[] =>
  [
    {
      field: 'customerNumber',
      colId: 'alert.customer_number.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      field: 'customerName',
      colId: 'alert.customer_name.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      field: 'materialNumber',
      colId: 'alert.material_number.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      field: 'materialDescription',
      colId: 'alert.material_description.column_header',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      field: 'type',
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
      field: 'materialClassification',
      colId: 'alert.material_classification.column_header',

      filter: 'agSetColumnFilter',
      filterParams: {
        values: materialClassificationOptions,
      },
      sortable: true,
    },
    {
      field: 'customerMaterialNumber',
      colId: 'alert.customer_material_number.column_header',
      cellRenderer: 'customerMaterialNumberCellRenderer',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      field: 'createdAt',
      colId: 'alert.report_date.column_header',
      valueFormatter: agGridLocalizationService.dateFormatter,
      type: 'rightAligned',
      sortable: true,
    },
    {
      field: 'dueDate',
      colId: 'alert.due_date.column_header',
      valueFormatter: agGridLocalizationService.dateFormatter,
      type: 'rightAligned',
      filter: 'agDateColumnFilter',
      sortable: true,
    },
    {
      field: 'comment',
      colId: 'alert.comment.column_header',
      cellRenderer: undefined,
      maxWidth: 375,
      sortable: false,
      tooltipValueGetter: (value) => value,
      tooltipField: 'comment',
    },
    {
      field: 'thresholdDeviation',
      colId: 'alert.thresholdDeviation.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      field: 'threshold1',
      colId: 'alert.threshold1.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      field: 'threshold1Description',
      colId: 'alert.threshold1Description.column_header',
      sortable: false,
    },
    {
      field: 'threshold2',
      colId: 'alert.threshold2.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      field: 'threshold2Description',
      colId: 'alert.threshold2Description.column_header',
      sortable: false,
    },
    {
      field: 'threshold3',
      colId: 'alert.threshold3.column_header',
      filter: 'agNumberColumnFilter',
      sortable: true,
    },
    {
      field: 'threshold3Description',
      colId: 'alert.threshold3Description.column_header',
      sortable: false,
    },
  ] as const;
