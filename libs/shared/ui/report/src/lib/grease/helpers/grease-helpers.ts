import { translate } from '@ngneat/transloco';

import { LabelValue } from '@schaeffler/label-value';

import { Field, TableItem } from '../../models';
import { GreaseResultData } from '../../models/grease-result.model';
import { suitabilityLevels } from '../constants/suitability.constants';
import { SuitabilityLevels } from '../models/suitability.model';

/**
 * Convert grease result data into a set of label-value pairs
 * Defaults to empty array
 */
export const adaptLabelValuesFromGreaseResultData = (
  greaseResults: GreaseResultData = []
): LabelValue[] =>
  greaseResults.length > 0
    ? greaseResults.map((greaseResultData) => ({
        label: translate(greaseResultData?.title || ''),
        labelHint: greaseResultData?.tooltip
          ? translate(greaseResultData?.tooltip)
          : undefined,
        value: greaseResultData?.values,
      }))
    : [];

/**
 * Get value from table item
 * Defaults to empty string
 */
export const itemValue = (
  tableItems: TableItem[] = [],
  searchField?: `${Field}`,
  tableItemsIndex?: number
): string | number => {
  if (searchField) {
    return tableItems.find(({ field }) => field === searchField)?.value || '';
  } else if (tableItemsIndex !== undefined) {
    return (
      tableItems.find((_item, index) => index === tableItemsIndex)?.value || ''
    );
  }

  return '';
};

/**
 * Get unit from table item
 * Defaults to empty string
 */
export const itemUnit = (
  tableItems: TableItem[] = [],
  searchField: `${Field}`
): string => tableItems.find(({ field }) => field === searchField)?.unit || '';

/**
 * Wrap value in styled HTML tags
 */
export const secondaryValue = (value: string): string =>
  `<span class="text-low-emphasis">${value}</span>`;

/**
 * Map suitability level strings
 * Defaults to empty string if level is unknown
 */
export const mapSuitabilityLevel = (
  suitabilityLevel: string
): keyof typeof SuitabilityLevels | string => {
  if (
    Object.values(SuitabilityLevels).includes(
      suitabilityLevel as SuitabilityLevels
    )
  ) {
    return suitabilityLevels[suitabilityLevel as `${SuitabilityLevels}`];
  }

  return '';
};

/** *************************************************************
 * extract and format specific table item properties
 */

export const manualRelubricationQuantity = (
  tableItems: TableItem[] = []
): number | undefined => {
  const min = itemValue(tableItems, Field.QVRE_MAN_MIN);
  const max = itemValue(tableItems, Field.QVRE_MAN_MAX);

  return min && max ? (+min + +max) / 2 : undefined;
};

export const manualRelubricationQuantityTimeSpan = (
  tableItems: TableItem[] = []
): number | undefined => {
  const min = itemValue(tableItems, Field.TFR_MIN);
  const max = itemValue(tableItems, Field.TFR_MAX);

  return min && max ? Math.round((+min + +max) / 2 / 24) : undefined;
};

export const greaseServiceLife = (
  tableItems: TableItem[] = []
): number | undefined => {
  const min = itemValue(tableItems, Field.TFG_MIN);
  const max = itemValue(tableItems, Field.TFG_MAX);

  return min && max ? Math.round((+min + +max) / 2 / 24) : undefined;
};

export const automaticRelubricationQuantityUnit = (
  tableItems: TableItem[] = []
): string => `${itemUnit(tableItems, Field.QVIN)}`;

export const automaticRelubricationQuantityPerDay = (
  tableItems: TableItem[] = []
): number =>
  (+itemValue(tableItems, Field.QVRE_AUT_MIN) +
    +itemValue(tableItems, Field.QVRE_AUT_MAX)) /
  2;

export const automaticRelubricationPerWeek = (
  tableItems: TableItem[] = []
): number | undefined => {
  const quantity = automaticRelubricationQuantityPerDay(tableItems);

  return quantity ? quantity * 7 : undefined;
};

export const automaticRelubricationPerMonth = (
  tableItems: TableItem[] = []
): number | undefined => {
  const quantity = automaticRelubricationQuantityPerDay(tableItems);

  return quantity ? quantity * 30 : undefined;
};

export const automaticRelubricationPerYear = (
  tableItems: TableItem[] = []
): number | undefined => {
  const quantity = automaticRelubricationQuantityPerDay(tableItems);

  return quantity ? quantity * 365 : undefined;
};
