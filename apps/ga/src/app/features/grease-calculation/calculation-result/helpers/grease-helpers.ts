import { translate } from '@ngneat/transloco';

import { LabelValue } from '@schaeffler/label-value';

import { suitabilityLevels } from '../constants/suitability.constants';
import {
  GreaseReportSubordinateDataItem,
  GreaseResultData,
  GreaseSuitabilityLevels,
  SubordinateDataItemField,
  SUITABILITY,
  SUITABILITY_LABEL,
} from '../models';

/**
 * Convert grease result data into a set of label-value pairs
 * Defaults to empty array
 */
export const adaptLabelValuesFromGreaseResultData = (
  greaseResults: GreaseResultData = []
): LabelValue[] =>
  greaseResults.length > 0
    ? greaseResults.map((greaseResultData) => ({
        label: translate(
          greaseResultData?.title
            ? `calculationResult.${greaseResultData.title}`
            : ''
        ),
        labelHint: greaseResultData?.tooltip
          ? translate(`calculationResult.${greaseResultData.tooltip}`)
          : undefined,
        value: greaseResultData?.values,
        ...(greaseResultData?.custom && { custom: greaseResultData.custom }),
      }))
    : [];

/**
 * Get value from table item
 * Defaults to empty string
 */
export const itemValue = (
  dataItems: GreaseReportSubordinateDataItem[] = [],
  searchField?: `${SubordinateDataItemField}`,
  tableItemsIndex?: number
): string | number => {
  if (searchField) {
    return dataItems.find(({ field }) => field === searchField)?.value || '';
  } else if (tableItemsIndex !== undefined) {
    return (
      dataItems.find((_item, index) => index === tableItemsIndex)?.value || ''
    );
  }

  return '';
};

/**
 * Get unit from table item
 * Defaults to empty string
 */
export const itemUnit = (
  dataItems: GreaseReportSubordinateDataItem[] = [],
  searchField: `${SubordinateDataItemField}`
): string => dataItems.find(({ field }) => field === searchField)?.unit || '';

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
): keyof typeof GreaseSuitabilityLevels | string => {
  if (
    Object.values(GreaseSuitabilityLevels).includes(
      suitabilityLevel as GreaseSuitabilityLevels
    )
  ) {
    return suitabilityLevels[suitabilityLevel as `${GreaseSuitabilityLevels}`];
  }

  return '';
};

/** *************************************************************
 * extract and format specific table item properties
 */

export const manualRelubricationQuantity = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const min = itemValue(dataItems, SubordinateDataItemField.QVRE_MAN_MIN);
  const max = itemValue(dataItems, SubordinateDataItemField.QVRE_MAN_MAX);

  return min && max ? (+min + +max) / 2 : undefined;
};

export const manualRelubricationQuantityTimeSpan = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const min = itemValue(dataItems, SubordinateDataItemField.TFR_MIN);
  const max = itemValue(dataItems, SubordinateDataItemField.TFR_MAX);

  return min && max ? Math.round((+min + +max) / 2 / 24) : undefined;
};

export const greaseServiceLife = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const min = itemValue(dataItems, SubordinateDataItemField.TFG_MIN);
  const max = itemValue(dataItems, SubordinateDataItemField.TFG_MAX);

  return min && max ? Math.round((+min + +max) / 2 / 24) : undefined;
};

export const automaticRelubricationQuantityUnit = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): string => `${itemUnit(dataItems, SubordinateDataItemField.QVIN)}`;

export const automaticRelubricationQuantityPerDay = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number =>
  (+itemValue(dataItems, SubordinateDataItemField.QVRE_AUT_MIN) +
    +itemValue(dataItems, SubordinateDataItemField.QVRE_AUT_MAX)) /
  2;

export const automaticRelubricationPerWeek = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const quantity = automaticRelubricationQuantityPerDay(dataItems);

  return quantity ? quantity * 7 : undefined;
};

export const automaticRelubricationPerMonth = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const quantity = automaticRelubricationQuantityPerDay(dataItems);

  return quantity ? quantity * 30 : undefined;
};

export const automaticRelubricationPerYear = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const quantity = automaticRelubricationQuantityPerDay(dataItems);

  return quantity ? quantity * 365 : undefined;
};

export const getConcept1Setting = (
  item: GreaseReportSubordinateDataItem[],
  c1size: SubordinateDataItemField
) => {
  const result = item.find(({ field }) => field === c1size)?.value;

  return `${result}`.trim() !== '-' ? +result : undefined;
};

export const getLabel = (
  suitability: SUITABILITY,
  anySetting: boolean
): SUITABILITY_LABEL => {
  let label: SUITABILITY_LABEL;
  if (suitability === SUITABILITY.NO && !anySetting) {
    label = SUITABILITY_LABEL.UNSUITED;
  } else if (!anySetting || (suitability === SUITABILITY.NO && anySetting)) {
    label = SUITABILITY_LABEL.NOT_SUITED;
  } else if (suitability === SUITABILITY.YES && anySetting) {
    label = SUITABILITY_LABEL.SUITED;
  } else if (suitability === SUITABILITY.CONDITION && anySetting) {
    label = SUITABILITY_LABEL.CONDITIONAL;
  } else if (suitability === SUITABILITY.UNKNOWN && anySetting) {
    label = SUITABILITY_LABEL.UNKNOWN;
  }

  return label;
};
