import { ValueFormatterParams } from 'ag-grid-community';

export const CUSTOM_DATE_FORMATTER = ({
  value,
}: ValueFormatterParams<any, number>) =>
  new Date(value * 1000).toLocaleDateString('en-GB');
