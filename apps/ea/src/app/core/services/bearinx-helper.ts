import { translate } from '@jsverse/transloco';

import { CatalogCalculationResult } from '../store/models';
import {
  BLOCK,
  LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY,
  LoadcaseValueType,
  STRING_ERROR_BLOCK,
  STRING_NOTE_BLOCK,
  STRING_WARNING_BLOCK,
  TABLE,
  TEXT,
  VARIABLE_BLOCK,
} from './bearinx-result.constant';
import {
  BearinxOnlineResult,
  BearinxOnlineResultSubordinate,
} from './bearinx-result.interface';

export const extractSubordinatesFromPath = (
  input: BearinxOnlineResult | BearinxOnlineResultSubordinate,
  path: Partial<BearinxOnlineResultSubordinate>[],
  requireValue?: boolean
): BearinxOnlineResultSubordinate | undefined => {
  let result: BearinxOnlineResultSubordinate = input;

  for (const pathItem of path) {
    // find sub item by identifier and designation
    const item = result.subordinates.find((subordinate) =>
      matchItem(subordinate, pathItem)
    );

    if (!item) {
      if (requireValue) {
        console.error('Unable to find subordinate', { result, pathItem });
      }

      return undefined;
    }

    result = item;
  }

  return result;
};

export const extractTableFromSubordinate = (
  input: Partial<BearinxOnlineResultSubordinate>
):
  | Record<
      string,
      { unit: string; value: string; short?: string; loadcaseName: string }
    >[]
  | undefined => {
  if (!input?.data) {
    return undefined;
  }

  const { items } = input.data;

  const results: Record<
    string,
    { unit: string; value: string; short?: string; loadcaseName: string }
  >[] = [];

  for (const loadcaseItem of items) {
    const loadcaseName: string = loadcaseItem.find(
      (item) =>
        item.field === translate(LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY)
    ).value;
    const result: Record<
      string,
      {
        value: string;
        unit: string;
        short?: string;
        loadcaseName: string;
      }
    > = {};
    for (const item of loadcaseItem.filter(
      ({ field }) =>
        field !== translate(LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY)
    )) {
      result[item.field] = {
        value: item.value,
        unit: item.unit,
        short: item.field,
        loadcaseName,
      };
    }
    results.push(result);
  }

  return results;
};

export const matchItem = (
  subordinate: BearinxOnlineResultSubordinate,
  objectToMatch: Partial<BearinxOnlineResultSubordinate>
): boolean =>
  Object.entries(objectToMatch).every(([key, value]) =>
    key in subordinate
      ? subordinate[key as keyof BearinxOnlineResultSubordinate] === value
      : value === undefined
  );

export const extractErrorsWarningsAndNotesFromResult = (
  input: BearinxOnlineResultSubordinate
): BearinxOnlineResultSubordinate[] =>
  input.subordinates.filter(
    (subordinate) =>
      subordinate.titleID === undefined && subordinate.identifier === BLOCK
  );

export const extractErrorsFromResult = (
  input: BearinxOnlineResultSubordinate
): BearinxOnlineResultSubordinate[] =>
  input.subordinates.filter(
    (subordinate) => subordinate.titleID === STRING_ERROR_BLOCK
  );

export const extractWarningsFromResult = (
  input: BearinxOnlineResultSubordinate
): BearinxOnlineResultSubordinate[] =>
  input.subordinates.filter(
    (subordinate) => subordinate.titleID === STRING_WARNING_BLOCK
  );

export const extractNotesFromResult = (
  input: BearinxOnlineResultSubordinate
): BearinxOnlineResultSubordinate[] =>
  input.subordinates.filter(
    (subordinate) => subordinate.titleID === STRING_NOTE_BLOCK
  );

export const formatMessageSubordinates = (
  rawSubordinates: BearinxOnlineResultSubordinate[]
): string[] => {
  const result: string[] = [];
  rawSubordinates.forEach((subordinate) => {
    if (subordinate.identifier === TEXT) {
      result.push(...subordinate.text);
    }
    if (subordinate.identifier === BLOCK) {
      result.push(...formatMessageSubordinates(subordinate.subordinates));
    }
  });

  return result.filter((e) => String(e).trim());
};

const shouldParseNumbers = (loadcaseKey: LoadcaseValueType): boolean =>
  loadcaseKey === LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS ||
  loadcaseKey === LoadcaseValueType.LUBRICATION ||
  loadcaseKey === LoadcaseValueType.FRICTION;

export const parseValueIfNeeded = (
  value: string,
  shouldParse: boolean
): string | number => {
  if (!shouldParse) {
    return value;
  }

  const numericValue = Number.parseFloat(value);

  return Number.isNaN(numericValue) ? value : numericValue;
};

export const createValueObject = (
  extractedValue: BearinxOnlineResultSubordinate,
  key: string,
  shouldParse: boolean
): {
  unit?: string;
  value: string | number;
  short?: string;
  title: string;
  loadcaseName: string;
} => {
  const processedValue = parseValueIfNeeded(extractedValue.value, shouldParse);

  return {
    value: processedValue,
    unit: extractedValue.unit,
    short: extractedValue.abbreviation,
    title: key,
    loadcaseName: '',
  };
};

const extractVariableBlockValues = <TResult extends Record<string, any>>(
  subordinate: BearinxOnlineResultSubordinate,
  values: Partial<Record<keyof TResult, string>>,
  shouldParse: boolean
): Record<string, unknown> => {
  const extractedValues: Record<string, unknown> = {};

  for (const [key, abbreviation] of Object.entries(values)) {
    const extractedValue = extractSubordinatesFromPath(subordinate, [
      { abbreviation },
    ]);

    if (extractedValue) {
      extractedValues[key] = createValueObject(
        extractedValue,
        key,
        shouldParse
      );
    }
  }

  return extractedValues;
};

const createTableRowEntry = (
  key: string,
  abbreviation: string,
  tableRow: Record<
    string,
    { unit: string; value: string; short?: string; loadcaseName: string }
  >,
  shouldParse: boolean
): [string, any] => {
  const processedValue = parseValueIfNeeded(
    tableRow[abbreviation].value,
    shouldParse
  );

  return [
    key,
    {
      value: processedValue,
      unit: tableRow[abbreviation].unit,
      short: tableRow[abbreviation].short,
      loadcaseName: tableRow[abbreviation].loadcaseName,
      title: key,
    },
  ];
};

const extractTableValues = <TResult extends Record<string, any>>(
  subordinate: BearinxOnlineResultSubordinate,
  values: Partial<Record<keyof TResult, string>>,
  shouldParse: boolean
): unknown[] => {
  const results: unknown[] = [];
  const tableData = extractTableFromSubordinate(subordinate);

  if (!tableData) {
    return results;
  }

  for (const tableRow of tableData) {
    const rowEntries = Object.entries(values)
      .filter(([_key, abbreviation]) => tableRow[abbreviation])
      .map(([key, abbreviation]) =>
        createTableRowEntry(key, abbreviation, tableRow, shouldParse)
      );

    results.push(Object.fromEntries(rowEntries));
  }

  return results;
};

export const extractValues = <
  TResult extends Record<
    string,
    {
      unit?: string;
      value: string | number;
      short?: string;
      title: string;
      loadcaseName: string;
    }
  >,
>(
  result: TResult & CatalogCalculationResult,
  subordinate: BearinxOnlineResultSubordinate,
  values: Partial<Record<keyof TResult, string>>,
  loadcaseKey: LoadcaseValueType
): void => {
  const shouldParse = shouldParseNumbers(loadcaseKey);
  const resultAsRecord = result as Record<LoadcaseValueType, unknown[]>;

  if (subordinate.identifier === VARIABLE_BLOCK) {
    const extractedValues = extractVariableBlockValues(
      subordinate,
      values,
      shouldParse
    );
    resultAsRecord[loadcaseKey] = [extractedValues];
  } else if (subordinate.identifier === TABLE) {
    const extractedValues = extractTableValues(
      subordinate,
      values,
      shouldParse
    );
    resultAsRecord[loadcaseKey] = extractedValues;
  }
};
