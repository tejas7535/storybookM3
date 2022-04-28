import { translate } from '@ngneat/transloco';

import { LabelValue } from '@schaeffler/label-value';

import { Field, TableItem } from '../../models/index';
import { GreaseResultData } from '../../models/grease-result.model';
import { suitabilityLevels } from '../constants/suitability.constants';
import { SuitabilityLevels } from '../models/suitability.model';

/**
 * Convert grease result data into a set of label-value pairs
 */
export const adaptLabelValuesFromGreaseResultData = (
  greaseResults: GreaseResultData[] | undefined
): LabelValue[] =>
  greaseResults?.length
    ? greaseResults.map((greaseResultData) => ({
        label: translate(greaseResultData?.title),
        labelHint: greaseResultData?.tooltip
          ? translate(greaseResultData?.tooltip)
          : undefined,
        value: greaseResultData?.values,
      }))
    : [];

export const findItem = (
  table1Values: TableItem[],
  searchField: Field
): TableItem =>
  table1Values?.find(
    ({ field }: TableItem) => field === searchField
  ) as TableItem;

// result in grams
export const mass = (
  item: TableItem[],
  amount: number,
  timespan?: string,
  tiny = false
): string => {
  const value =
    (item.find(({ field }) => field === Field.RHO)?.value as number) * amount;

  return `<span>${tiny ? formatDecimals(value) : value.toFixed(2)} g${
    timespan ? `/${timespan}` : ''
  }</span>`;
};

// wrap value in styled HTML tags
export const secondaryValue = (value: string): string =>
  `<span class="text-low-emphasis">${value}</span>`;

export const initialGreaseQuantity = (table1Values: TableItem[]) =>
  `${findItem(table1Values, Field.QVIN).value} ${
    findItem(table1Values, Field.QVIN).unit
  }`;

export const manualRelubricationQuantity = (
  table1Values: TableItem[]
): number =>
  (+(findItem(table1Values, Field.QVRE_MAN_MIN) as any).value +
    +(findItem(table1Values, Field.QVRE_MAN_MAX) as any).value) /
  2;

export const manualRelubricationQuantitySpan = (
  table1Values: TableItem[]
): string =>
  `${Math.round(
    (+(findItem(table1Values, Field.TFR_MIN) as any).value +
      +(findItem(table1Values, Field.TFR_MAX) as any).value) /
      2 /
      24
  )} ${translate('days')}`;

export const automaticRelubricationQuantityPerDay = (
  table1Values: TableItem[]
): number =>
  (+(findItem(table1Values, Field.QVRE_AUT_MIN) as any).value +
    +(findItem(table1Values, Field.QVRE_AUT_MAX) as any).value) /
  2;

export const automaticRelubricationPerWeek = (
  table1Values: TableItem[]
): number => automaticRelubricationQuantityPerDay(table1Values) * 7;

export const automaticRelubricationQuantityUnit = (
  table1Values: TableItem[]
): string => `${findItem(table1Values, Field.QVIN).unit}`;

export const automaticRelubricationPerMonth = (
  table1Values: TableItem[]
): number => automaticRelubricationQuantityPerDay(table1Values) * 30;

export const automaticRelubricationPerYear = (
  table1Values: TableItem[]
): number => automaticRelubricationQuantityPerDay(table1Values) * 365;

export const formatDecimals = (value: number) =>
  value.toLocaleString(
    'en-US', // should be dynamic at some point
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }
  );

export const checkSuitability = (
  suitable: `${SuitabilityLevels}`
): keyof typeof SuitabilityLevels => suitabilityLevels[suitable];
