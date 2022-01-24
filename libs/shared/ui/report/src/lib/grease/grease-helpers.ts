import { translate } from '@ngneat/transloco';
import { Field, TableItem } from '../models';

export const findItem = (
  table1Values: TableItem[],
  searchField: Field
): TableItem =>
  table1Values?.find(
    ({ field }: TableItem) => field === searchField
  ) as TableItem;

// result in gramm
export const mass = (
  item: TableItem[],
  amount: number,
  timespan?: string
): string =>
  `<span class="text-low-emphasis">${(
    (item.find(({ field }) => field === Field.RHO)?.value as number) * amount
  ).toFixed(2)} g${timespan ? `/${timespan}` : ''}</span>`;

export const initalGreaseQuantity = (table1Values: TableItem[]) =>
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
      +(findItem(table1Values, Field.TFR_MIN) as any).value) /
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
