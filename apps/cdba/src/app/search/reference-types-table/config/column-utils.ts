import { DatePipe, DecimalPipe } from '@angular/common';

import {
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-enterprise/all-modules';

const decimalPipe = new DecimalPipe('de-DE');
const datePipe = new DatePipe('de-DE');

export const currentYear = new Date().getFullYear();

export const formatNumber = (params: ValueFormatterParams) =>
  decimalPipe.transform(params.value, '1.0-2');

export const formatDate = (params: ValueFormatterParams) =>
  datePipe.transform(params.value);

export const valueGetterDate = (params: ValueGetterParams, key: string) =>
  new Date(params.data[key]);

export const valueGetterArray = (
  params: ValueGetterParams,
  key: string,
  index: number
) => {
  const { data } = params;

  return data[key] ? data[key][index] : undefined;
};
