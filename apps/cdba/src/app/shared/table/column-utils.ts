import { DatePipe, DecimalPipe } from '@angular/common';

import {
  GetMainMenuItemsParams,
  MenuItemDef,
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

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

export const formatLongValue = (
  params: ValueFormatterParams,
  maxChars = 100
) => {
  const { value } = params;

  return value?.length > maxChars ? `${value.slice(0, maxChars)}...` : value;
};

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

/**
 * Provide custom items for main menu of the table.
 */
export const getMainMenuItems = (
  params: GetMainMenuItemsParams
): (string | MenuItemDef)[] => {
  const menuItems: (string | MenuItemDef)[] = [...params.defaultItems];

  const resetFilter: MenuItemDef = {
    name: translate('shared.table.columnMenu.resetFilter.menuEntry'),
    tooltip: translate('shared.table.columnMenu.resetFilter.tooltip'),
    action: () => {
      params.api.setFilterModel(undefined);
    },
  };

  const resetTable: MenuItemDef = {
    name: translate('shared.table.columnMenu.resetTable.menuEntry'),
    tooltip: translate('shared.table.columnMenu.resetTable.tooltip'),
    action: () => {
      params.api.setFilterModel(undefined);
      params.columnApi.resetColumnGroupState();
      params.columnApi.resetColumnState();
    },
  };

  menuItems.push(resetFilter);
  menuItems.push(resetTable);

  return menuItems;
};
