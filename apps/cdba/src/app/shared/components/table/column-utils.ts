import {
  GetMainMenuItemsParams,
  MenuItemDef,
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-enterprise/all-modules';
import { getEnv } from '@cdba/environments/environment.provider';
import { getValueFromObject } from '@cdba/shared/utils';
import { translate } from '@ngneat/transloco';

import {
  MaterialNumberPipe,
  ScrambleMaterialDesignationPipe,
  ScrambleMaterialNumberPipe,
} from '../../pipes';

const materialNumberPipe = new MaterialNumberPipe();
const scrambleMaterialNumberPipe = new ScrambleMaterialNumberPipe(getEnv());
const scrambleMaterialDesignationPipe = new ScrambleMaterialDesignationPipe(
  getEnv()
);

export const currentYear = new Date().getFullYear();

export const scrambleMaterialDesignation = (
  params: ValueFormatterParams,
  mock?: 0 | 1
) => scrambleMaterialDesignationPipe.transform(params.value, mock);

export const formatMaterialNumber = (params: ValueFormatterParams) =>
  scrambleMaterialNumberPipe.transform(
    formatMaterialNumberFromString(params.value)
  );

export const formatMaterialNumberFromString = (value: string) =>
  materialNumberPipe.transform(value);

export const formatLongValue = (
  params: ValueFormatterParams,
  maxChars = 100
) => {
  const { value } = params;

  return value?.length > maxChars ? `${value.slice(0, maxChars)}...` : value;
};

export const valueGetterDate = <T>(params: ValueGetterParams, key: keyof T) =>
  params?.data?.[key] ? new Date(params.data[key]) : undefined;

export const valueGetterFromArray = <T>(
  params: ValueGetterParams,
  key: keyof T,
  index: number
) => {
  const { data } = params;

  return data?.[key]?.[index];
};

export const valueGetterFromArrayOfObjects = <T, TObj>(
  params: ValueGetterParams,
  key: keyof T,
  index: number,
  objectKey: keyof TObj
) => {
  const { data } = params;

  return getValueFromObject<TObj>(data?.[key]?.[index], objectKey);
};

/**
 * Map column definition field to related property of ReferenceType.
 */
export const columnDefinitionToReferenceTypeProp = (def: string) => {
  switch (def) {
    case 'actualQuantityLastYear':
      return 'actualQuantities';
    case 'actualQuantityLastYearMinus1':
      return 'actualQuantities';
    case 'actualQuantityLastYearMinus2':
      return 'actualQuantities';
    case 'actualQuantityLastYearMinus3':
      return 'actualQuantities';
    case 'plannedQuantityCurrentYear':
      return 'plannedQuantities';
    case 'plannedQuantityCurrentYearPlus1':
      return 'plannedQuantities';
    case 'plannedQuantityCurrentYearPlus2':
      return 'plannedQuantities';
    case 'plannedQuantityCurrentYearPlus3':
      return 'plannedQuantities';
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

  menuItems.push(resetFilter, resetTable);

  return menuItems;
};

export const matchAllFractionsForIntegerValue = (
  filterValues: number[] | null,
  cellValue: number | null
) =>
  filterValues[0] === cellValue ||
  (filterValues[0] === Math.trunc(filterValues[0]) &&
    filterValues[0] === Math.trunc(cellValue));

export const transformGermanFractionSeparator = (text: string | null) =>
  text === null
    ? undefined
    : Number.parseFloat(text.toString().replace(',', '.'));

const onlyNumericValuesRegExp = '\\d\\,\\.';

export const filterParamsForDecimalValues = {
  numberParser: transformGermanFractionSeparator,
  allowedCharPattern: onlyNumericValuesRegExp,
  filterOptions: [
    {
      displayKey: 'equalsInteger',
      displayName: 'Equals Integer',
      predicate: matchAllFractionsForIntegerValue,
    },
    'equals',
    'notEqual',
    'lessThan',
    'lessThanOrEqual',
    'greaterThan',
    'greaterThanOrEqual',
    'inRange',
    'empty',
  ],
};
