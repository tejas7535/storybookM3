import { DatePipe, DecimalPipe } from '@angular/common';

import {
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-community/core';

import { MaterialNumberPipe } from '../pipes';

const decimalPipe = new DecimalPipe('de-DE');
const datePipe = new DatePipe('de-DE');
const materialNumberPipe = new MaterialNumberPipe();

export const currentYear = new Date().getFullYear();

export const formatNumber = (
  params: ValueFormatterParams,
  digitsInfo: string = '1.0-2'
) => decimalPipe.transform(params.value, digitsInfo);

export const formatDate = (params: ValueFormatterParams) =>
  datePipe.transform(params.value);

export const formatMaterialNumber = (params: ValueFormatterParams) =>
  materialNumberPipe.transform(params.value);

export const valueGetterDate = (params: ValueGetterParams, key: string) =>
  params?.data?.[key] ? new Date(params.data[key]) : undefined;

export const valueGetterArray = (
  params: ValueGetterParams,
  key: string,
  index: number
) => {
  const { data } = params;

  return data?.[key]?.[index];
};

/**
 * Map column definition field to related property of ReferenceType.
 */
export const columnDefinitionToReferenceTypeProp = (def: string) => {
  switch (def) {
    case 'averagePrice':
      return 'averagePrices';
    case 'actualQuantityLastYear':
      return 'actualQuantities';
    case 'actualQuantityLastYearMinus1':
      return 'actualQuantities';
    case 'actualQuantityLastYearMinus2':
      return 'actualQuantities';
    case 'actualQuantityLastYearMinus3':
      return 'actualQuantities';
    case 'netSalesLastYear':
      return 'netSales';
    case 'netSalesLastYearMinus1':
      return 'netSales';
    case 'netSalesLastYearMinus2':
      return 'netSales';
    case 'netSalesLastYearMinus3':
      return 'netSales';
    case 'plannedQuantityCurrentYear':
      return 'plannedQuantities';
    case 'plannedQuantityCurrentYearPlus1':
      return 'plannedQuantities';
    case 'plannedQuantityCurrentYearPlus2':
      return 'plannedQuantities';
    case 'plannedQuantityCurrentYearPlus3':
      return 'plannedQuantities';
    case 'msd':
      return 'materialShortDescription';
    default:
      return def;
  }
};
