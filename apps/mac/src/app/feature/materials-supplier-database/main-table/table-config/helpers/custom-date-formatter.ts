import { ValueFormatterParams } from 'ag-grid-community';

export const CUSTOM_DATE_FORMATTER = ({
  value,
}: ValueFormatterParams<any, number>) =>
  new Date(value * 1000).toLocaleDateString('en-GB');

export const SAP_MATERIALS_DATE_FORMATTER = ({
  value,
}: ValueFormatterParams<any, number>) =>
  value ? new Date(value).toLocaleDateString('en-GB') : undefined;
