import { GridApi } from 'ag-grid-enterprise';

export interface GridApis {
  api: GridApi;
}

export enum ColumnValueType {
  Monetary = 'monetary',
  Percentage = 'percentage',
  Months = 'months',
  Default = 'default',
}

export enum AgGridFilterType {
  Text = 'agTextColumnFilter',
  Number = 'agNumberColumnFilter',
  Date = 'agDateColumnFilter',
}
