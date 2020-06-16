import { DatePipe, DecimalPipe } from '@angular/common';

import {
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-community/core';

const decimalPipe = new DecimalPipe('de-DE');
const datePipe = new DatePipe('de-DE');

export const currentYear = new Date().getFullYear();

export const formatNumber = (params: ValueFormatterParams) =>
  decimalPipe.transform(params.value, '1.0-2');

export const formatDate = (params: ValueFormatterParams) =>
  datePipe.transform(params.value);

export const valueGetterDate = (params: ValueGetterParams, key: string) =>
  params.data ? new Date(params.data[key]) : undefined;

export const valueGetterArray = (
  params: ValueGetterParams,
  key: string,
  index: number
) => {
  const { data } = params;

  if (data) {
    return data[key] ? data[key][index] : undefined;
  }

  return undefined;
};
