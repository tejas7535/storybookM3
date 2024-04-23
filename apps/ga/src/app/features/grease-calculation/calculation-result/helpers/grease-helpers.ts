import { translate } from '@jsverse/transloco';

import { RotaryControlItem } from '@schaeffler/controls';
import { LabelValue } from '@schaeffler/label-value';

import {
  concept1Queries,
  greaseSizeExceptions,
  suitabilityLevels,
} from '../constants';
import {
  CONCEPT1_SIZES,
  GreaseReportSubordinateDataItem,
  GreaseResultData,
  GreaseResultDataItem,
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
        labelHint: getLabelHintForResult(greaseResultData),
        value: greaseResultData?.values,
        ...(greaseResultData?.custom && { custom: greaseResultData.custom }),
      }))
    : [];

const getLabelHintForResult = (
  dataItem: GreaseResultDataItem
): string | undefined =>
  dataItem?.custom?.data
    ? getLabelHintForCustomInput(dataItem)
    : getLabelHintForRegularInput(dataItem);

const getLabelHintForCustomInput = (
  dataItem: GreaseResultDataItem
): string | undefined => {
  if (dataItem.custom?.data?.c1_60 || dataItem.custom?.data?.c1_125) {
    return dataItem.custom?.data?.hint ?? undefined;
  }

  return undefined;
};

const getLabelHintForRegularInput = (
  dataItem: GreaseResultDataItem
): string | undefined =>
  dataItem?.tooltip
    ? translate(`calculationResult.${dataItem.tooltip}`)
    : undefined;

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

export const greaseServiceLife = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const minValue = itemValue(dataItems, SubordinateDataItemField.TFG_MIN);
  const maxValue = itemValue(dataItems, SubordinateDataItemField.TFG_MAX);
  const min = convertInputToNumberWithoutSpecialCharacters(minValue);
  const max = convertInputToNumberWithoutSpecialCharacters(maxValue);

  return min && max ? Math.round((min + max) / 2 / 24) : undefined;
};

const convertInputToNumberWithoutSpecialCharacters = (
  valueToFormat: string | number | undefined
): number | undefined => {
  if (!valueToFormat) {
    return undefined;
  }

  const clearedText = valueToFormat.toString().replace(/[<>]/, '');

  return +clearedText;
};

export const relubricationQuantityUnit = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): string => `${itemUnit(dataItems, SubordinateDataItemField.QVIN)}`;

const relubricationQuantityPerDay = (
  dataItems: GreaseReportSubordinateDataItem[] = []
): number =>
  (+itemValue(dataItems, SubordinateDataItemField.QVRE_AUT_MIN) +
    +itemValue(dataItems, SubordinateDataItemField.QVRE_AUT_MAX)) /
  2;

export const relubricationPerDays = (
  numberOfDays: number,
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const quantity = relubricationQuantityPerDay(dataItems);

  return quantity ? quantity * numberOfDays : undefined;
};

export const relubricationPerOperatingHours = (
  numberOfOperatingHours: number,
  dataItems: GreaseReportSubordinateDataItem[] = []
): number | undefined => {
  const quantity = relubricationQuantityPerDay(dataItems);

  return quantity ? (quantity / 24) * numberOfOperatingHours : undefined;
};

export const getConcept1Setting = (
  item: GreaseReportSubordinateDataItem[],
  c1size: SubordinateDataItemField
) => {
  const result = item.find(({ field }) => field === c1size)?.value;

  return `${result}`.trim() === '-' ? undefined : +result;
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

const monthsWithNumber = new Set([0, 1, 3, 6, 9, 12]);
export const availableMonths: RotaryControlItem[] = Array.from(
  { length: 13 },
  (_, index) => ({
    label: monthsWithNumber.has(index) ? index.toString() : '',
    highlight: index === 0,
  })
);

export const shortTitle = (title: string): string =>
  title.replace('Arcanol ', '');

export const concept1InShop = (title: string, size: CONCEPT1_SIZES): string => {
  const search = `${size}-${shortTitle(title).replace(' ', '')}`;

  return concept1Queries.find((query) => query.includes(search));
};

export const concept1ShopQuery = (
  title: string,
  size: CONCEPT1_SIZES
): string => concept1InShop(title, size) ?? `ARCALUB-C1-${size}-REFILLABLE`;

export const greaseShopQuery = (title: string): string =>
  `${title.replaceAll(' ', '-')}-${
    greaseSizeExceptions.find((grease) => grease.title === title)?.size ?? 1
  }kg`;

export const greaseLinkText = (title: string): string =>
  `${title} ${
    greaseSizeExceptions.find((grease) => grease.title === title)?.size ?? 1
  }kg`;

export const isGreaseSuited = (label: SUITABILITY_LABEL): boolean =>
  label === SUITABILITY_LABEL.SUITED;

export const isGreaseUnSuited = (label: SUITABILITY_LABEL): boolean =>
  label === SUITABILITY_LABEL.UNSUITED;
