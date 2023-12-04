import { translate } from '@ngneat/transloco';

import {
  CalculationResultReportInput,
  CatalogCalculationResult,
  ReportMessage,
} from '../store/models';
import {
  BLOCK,
  LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY,
  LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY,
  LOADCASE_TYPE_OF_MOTION_TRANSLATION_KEY,
  LoadcaseValueType,
  STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES,
  STRING_OUTP_LOAD,
  STRING_OUTP_LOADCASE_DATA,
  TABLE,
  TEXT,
  VARIABLE_BLOCK,
  VARIABLE_LINE,
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

export const formatErrorsWarningsAndNotesResult = (
  input: BearinxOnlineResultSubordinate[]
): ReportMessage[] => input.map((message) => getItemValue(message));

const getItemValue = (input: BearinxOnlineResultSubordinate): ReportMessage => {
  const result: ReportMessage = {};

  if (input.title) {
    result.title = input.title;
  }

  if (input.identifier === BLOCK) {
    result.item = {
      subItems: formatErrorsWarningsAndNotesResult(input.subordinates),
    };
  }

  if (input.identifier === TEXT) {
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
    hasNestedStructure:
      input.identifier === BLOCK || input.identifier === TABLE ? true : false,
    title: input?.title,
    titleID: input?.titleID,
  };

  if (input.identifier === BLOCK || input.identifier === VARIABLE_BLOCK) {
    if (input.titleID === STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES) {
      result.title = input.subordinates.find(
        (subordinate) => subordinate.titleID === STRING_OUTP_LOAD
      ).title;
      result.subItems = extractReportInputForAllLoadTableSubordinates(
        input.subordinates
      );
    } else {
      result.subItems = formatReportInputResult(input.subordinates);
    }
  }

  if (input.identifier === TABLE) {
    result.subItems = extractReportInputFromTableSubordinate(input);
  }

  if (input.identifier === VARIABLE_LINE) {
    result.designation = input?.designation;
    result.abbreviation = input?.abbreviation;
    result.value = input?.value;
    result.unit = input?.unit;
  }

  return result;
};

const extractReportInputForAllLoadTableSubordinates = (
  input: Partial<BearinxOnlineResultSubordinate[]>
): CalculationResultReportInput[] | undefined => {
  if (
    input?.length !== 2 ||
    !input?.some(
      (subordinate) => subordinate.titleID === STRING_OUTP_LOADCASE_DATA
    ) ||
    !input?.some((subordinate) => subordinate.titleID === STRING_OUTP_LOAD)
  ) {
    return undefined;
  }

  const combinedLoadInputs: CalculationResultReportInput[] = [];

  for (const loadInputSubordinate of input) {
    const description = loadInputSubordinate.description;
    const { items } = loadInputSubordinate.data;

    for (const loadcaseItem of items) {
      const loadcaseName = loadcaseItem.find(
        (item) =>
          item.field ===
          translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
      ).value;

      const newInputs = loadcaseItem
        .filter(
          (tableRow) =>
            tableRow.field !==
            translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
        )
        .map((tableRow) => ({
          hasNestedStructure: false,
          designation: mapFieldsWithDescriptions(
            tableRow.field,
            description.entries
          ),
          value: tableRow.value,
          unit: tableRow?.unit,
        }));

      if (
        combinedLoadInputs.some((loadInput) => loadInput.title === loadcaseName)
      ) {
        combinedLoadInputs
          .find((loadInput) => loadInput.title === loadcaseName)
          ?.subItems.push(...newInputs);
      } else {
        combinedLoadInputs.push({
          hasNestedStructure: false,
          title: loadcaseName,
          subItems: newInputs,
        });
      }
    }
  }

  return combinedLoadInputs;
};

const extractReportInputFromTableSubordinate = (
  input: Partial<BearinxOnlineResultSubordinate>
): CalculationResultReportInput[] | undefined => {
  if (!input?.data) {
    return undefined;
  }

  const description = input.description;
  const { items } = input.data;

  const newInputs = items.map((loadcaseItem, index) => ({
    subItems: loadcaseItem
      .filter(
        (tableRow) =>
          tableRow.field !==
          translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
      )
      .map((tableRow) => ({
        hasNestedStructure: false,
        designation: mapFieldsWithDescriptions(
          tableRow.field,
          description.entries
        ),
        value: tableRow.value,
        unit: tableRow?.unit,
      })),
    hasNestedStructure: false,
    titleID: index.toString(),
    title: loadcaseItem.find(
      (tableRow) =>
        tableRow.field ===
        translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
    )?.value,
  }));

  return newInputs;
};

const mapFieldsWithDescriptions = (
  field: string,
  mapping: [string, string][]
): string => {
  // type of movement field name is empty for multi load case results because it has no abbreviation
  if (field === '') {
    return translate(LOADCASE_TYPE_OF_MOTION_TRANSLATION_KEY);
  }

  const designation = mapping.find(
    ([abbreviation, _designation]) => abbreviation.replace(': ', '') === field
  )?.[1];

  return `${designation} (${field})`;
};

export const extractValues = <
  TResult extends Record<
    string,
    {
      unit?: string;
      value: string;
      short?: string;
      title: string;
      loadcaseName: string;
    }
  >
>(
  result: TResult & CatalogCalculationResult,
  subordinate: BearinxOnlineResultSubordinate,
  values: Partial<Record<keyof TResult, string>>,
  loadcaseKey: LoadcaseValueType
): void => {
  if (subordinate.identifier === VARIABLE_BLOCK) {
    const extractedValues: {
      [key: string]: {
        unit: string;
        value: number;
        short?: string;
        title: string;
        loadcaseName: string;
      };
    } = {};
    for (const [key, abbreviation] of Object.entries(values)) {
      const extractedValue = extractSubordinatesFromPath(subordinate, [
        {
          abbreviation,
        },
      ]);

      if (extractedValue) {
        const value = {
          value: Number.parseFloat(extractedValue.value),
          unit: extractedValue.unit,
          short: extractedValue.abbreviation,
          title: key,
          loadcaseName: '',
        } as any;
        extractedValues[key] = value;
      }
    }
    result[loadcaseKey] = [extractedValues];
  } else if (subordinate.identifier === TABLE) {
    result[loadcaseKey] = [];
    for (const tableRow of extractTableFromSubordinate(subordinate)) {
      result[loadcaseKey].push(
        Object.fromEntries(
          Object.entries(values)
            .filter(([_key, abbreviation]) => tableRow[abbreviation])
            .map(([key, abbreviation]) => [
              key,
              {
                value: Number.parseFloat(tableRow[abbreviation].value),
                unit: tableRow[abbreviation].unit,
                short: tableRow[abbreviation].short,
                loadcaseName: tableRow[abbreviation].loadcaseName,
                title: key,
              },
            ])
        )
      );
    }
  }
};
