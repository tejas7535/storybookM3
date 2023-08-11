import { CalculationResultReportInput, ReportMessage } from '../store/models';
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
): Record<string, { unit: string; value: string }> | undefined => {
  if (!input?.data) {
    return undefined;
  }

  const { items } = input.data;

  if (items.length > 1) {
    throw new Error('Only one line tables supported');
  }

  const result: Record<string, { unit: string; value: string }> = {};

  for (const item of items[0]) {
    result[item.field] = { unit: item.unit, value: item.value };
  }

  return result;
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
      subordinate.titleID === undefined && subordinate.identifier === 'block'
  );

export const formatErrorsWarningsAndNotesResult = (
  input: BearinxOnlineResultSubordinate[]
): ReportMessage[] => input.map((message) => getItemValue(message));

const getItemValue = (input: BearinxOnlineResultSubordinate): ReportMessage => {
  const result: ReportMessage = {};

  if (input.title) {
    result.title = input.title;
  }

  if (input.identifier === 'block') {
    result.item = {
      subItems: formatErrorsWarningsAndNotesResult(input.subordinates),
    };
  }

  if (input.identifier === 'text') {
    result.item = {
      messages: input.text,
    };
  }

  return result;
};

export const formatReportInputResult = (
  input: BearinxOnlineResultSubordinate[]
): CalculationResultReportInput[] =>
  input?.map((reportInput) => getReportInput(reportInput));

const getReportInput = (
  input: BearinxOnlineResultSubordinate
): CalculationResultReportInput => {
  const result: CalculationResultReportInput = {
    hasNestedStructure: input.identifier === 'block' ? true : false,
    title: input?.title,
    titleID: input?.titleID,
  };

  if (input.identifier === 'block' || input.identifier === 'variableBlock') {
    result.subItems = formatReportInputResult(input.subordinates);
  }

  if (input.identifier === 'table') {
    result.subItems = extractReportInputFromTableSubordinate(input);
  }

  if (input.identifier === 'variableLine') {
    result.designation = input?.designation;
    result.abbreviation = input?.abbreviation;
    result.value = input?.value;
    result.unit = input?.unit;
  }

  return result;
};

const extractReportInputFromTableSubordinate = (
  input: Partial<BearinxOnlineResultSubordinate>
): CalculationResultReportInput[] | undefined => {
  if (!input?.data) {
    return undefined;
  }

  const { items } = input.data;

  if (items.length > 1) {
    throw new Error('Only one line tables supported');
  }

  return items[0].map((tableRow) => ({
    hasNestedStructure: false,
    designation: tableRow.field,
    value: tableRow.value,
    unit: tableRow?.unit,
  }));
};

export const extractValues = <
  TResult extends Record<string, { unit: string; value: string }>
>(
  result: TResult,
  subordinate: BearinxOnlineResultSubordinate,
  values: Partial<Record<keyof TResult, string>>
): void => {
  for (const [key, abbreviation] of Object.entries(values)) {
    const extractedValue = extractSubordinatesFromPath(subordinate, [
      {
        abbreviation,
      },
    ]);
    if (extractedValue) {
      result[key as keyof TResult] = {
        value: Number.parseFloat(extractedValue.value),
        unit: extractedValue.unit,
      } as any;
    }
  }
};
