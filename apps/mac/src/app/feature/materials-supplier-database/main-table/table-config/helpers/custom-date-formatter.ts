import { ValueFormatterParams } from 'ag-grid-community';

export const CUSTOM_DATE_FORMATTER = (
  params: ValueFormatterParams<any, number>
) => new Date(params.value * 1000).toLocaleDateString('en-GB');

export const SAP_MATERIALS_DATE_FORMATTER = (
  params: ValueFormatterParams<any, number>
) =>
  params.value ? new Date(params.value).toLocaleDateString('en-GB') : undefined;
