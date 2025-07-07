import { ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment';

export const CUSTOM_DATE_FORMATTER = (
  params: ValueFormatterParams<any, number>
) => moment(params.value * 1000).format('YYYY-MM-DD');

export const SAP_MATERIALS_DATE_FORMATTER = (
  params: ValueFormatterParams<any, number>
) => (params.value ? moment(params.value).format('YYYY-MM-DD') : undefined);
