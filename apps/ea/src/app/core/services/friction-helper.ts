import { FrictionCalculationResult, ReportMessage } from '../store/models';
import {
  extractErrorsWarningsAndNotesFromResult,
  extractSubordinatesFromPath,
  extractTableFromSubordinate,
  formatErrorsWarningsAndNotesResult,
  formatReportInputResult,
} from './bearinx-helper';
import { BearinxOnlineResult } from './bearinx-result.interface';

export const INPUT_WHITELIST_TITLE_IDS = [
  'STRING_OUTP_BEARING_DATA',
  'STRING_OUTP_CO2E_CALCULATION',
  'STRING_OUTP_BEARING_DIMENSIONS',
  'STRING_OUTP_LUBRICATION',
  'STRING_OUTP_OPERATING_CONDITIONS',
  'STRING_OUTP_OPERATING_CONDITIONS_STRING_OUTP_FOR_ALL_LOADCASES',
  'STRING_OUTP_LOADS_AND_DISPLACEMENTS_STRING_OUTP_FOR_ALL_LOADCASES',
  'STRING_OUTP_INPUT',
  'STRING_OUTP_RESULTS',
  'STRING_OUTP_CO2E',
];

export const convertFrictionApiResult = (
  originalResult: BearinxOnlineResult
): FrictionCalculationResult => {
  const result: FrictionCalculationResult = {};

  const co2Subordinate = extractSubordinatesFromPath(originalResult, [
    { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
    { titleID: 'STRING_OUTP_CO2E', identifier: 'block' },
    { titleID: 'STRING_OUTP_CO2E_CALCULATION', identifier: 'variableBlock' },
    { identifier: 'variableLine' },
  ]);

  if (co2Subordinate) {
    result.co2_downstream = {
      unit: co2Subordinate.unit,
      value: Number.parseFloat(co2Subordinate.value),
    };
  }

  const maxFrictionalTorqueSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
      { titleID: 'STRING_OUTP_FRICTIONAL_CALCULATION', identifier: 'block' },
      { titleID: 'STRING_OUTP_FRICTIONAL_VALUES', identifier: 'variableBlock' },
      { abbreviation: 'M_R_max', identifier: 'variableLine' },
    ]
  );

  const inputData = extractSubordinatesFromPath(originalResult, [
    { titleID: 'STRING_OUTP_INPUT', identifier: 'block' },
  ]);

  const formattedInputData = formatReportInputResult(inputData?.subordinates);

  if (formattedInputData) {
    const filteredInputData = formattedInputData
      .filter((input) => INPUT_WHITELIST_TITLE_IDS.includes(input.titleID))
      .map((input) => {
        if (!input.hasNestedStructure) {
          return input;
        }

        const newSubordinates = input.subItems.filter((filterInput) =>
          INPUT_WHITELIST_TITLE_IDS.includes(filterInput.titleID)
        );
        if (newSubordinates) {
          input.subItems = newSubordinates;
        }

        return input;
      });

    result.reportInputSuborinates = {
      inputSubordinates: filteredInputData,
    };
  }

  const messages = extractErrorsWarningsAndNotesFromResult(originalResult);

  const formattedMessages: ReportMessage[] =
    formatErrorsWarningsAndNotesResult(messages);

  if (formattedMessages) {
    result.reportMessages = {
      messages: formattedMessages,
    };
  }

  if (maxFrictionalTorqueSubordinate) {
    result.max_frictionalTorque = {
      unit: maxFrictionalTorqueSubordinate.unit,
      value: Number.parseFloat(maxFrictionalTorqueSubordinate.value),
    };
  }

  const frictionResultSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { identifier: 'block', titleID: 'STRING_OUTP_RESULTS' },
      { identifier: 'table', titleID: undefined },
    ]
  );

  const frictionResultTable =
    frictionResultSubordinate &&
    extractTableFromSubordinate(frictionResultSubordinate);
  if (frictionResultSubordinate) {
    const { ny, M_R, N_R, N_Se, N_Uz } = frictionResultTable;

    if (N_R) {
      result.frictionalPowerloss = {
        value: Number.parseFloat(N_R.value),
        unit: N_R.unit,
      };
    }

    if (N_Se) {
      result.frictionalPowerlossSealing = {
        value: Number.parseFloat(N_Se.value),
        unit: N_Se.unit,
      };
    }

    if (N_Uz) {
      result.frictionalPowerlossUnloadedZone = {
        value: Number.parseFloat(N_Uz.value),
        unit: N_Uz.unit,
      };
    }

    if (M_R) {
      result.frictionalTorque = {
        value: Number.parseFloat(M_R.value),
        unit: M_R.unit,
      };
    }

    if (ny) {
      result.operatingViscosity = {
        value: Number.parseFloat(ny.value),
        unit: ny.unit,
      };
    }
  }

  return result;
};
