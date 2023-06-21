import { FrictionCalculationResult, ReportMessage } from '../store/models';
import {
  extractErrorsWarningsAndNotesFromResult,
  extractSubordinatesFromPath,
  extractTableFromSubordinate,
  formatErrorsWarningsAndNotesResult,
} from './bearinx-helper';
import { BearinxOnlineResult } from './bearinx-result.interface';

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

  if (inputData?.subordinates) {
    result.reportInputSuborinates = {
      inputSubordinates: inputData.subordinates,
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
