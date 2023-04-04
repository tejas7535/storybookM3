import { CalculationResult } from '../store/models';
import {
  CO2ServiceCalculationResult,
  ResultSubordinate,
} from './co2-service.interface';

export const convertCO2ApiResult = (
  originalResult: CO2ServiceCalculationResult
): CalculationResult => {
  const co2Subordinate = extractSubordinatesFromPath(originalResult, [
    { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
    { titleID: 'STRING_OUTP_CO2', identifier: 'block' },
    { titleID: 'STRING_OUTP_CO2_EMISSIONS', identifier: 'variableBlock' },
    { identifier: 'variableLine', designation: 'CO2-emission' },
  ]);

  if (!co2Subordinate) {
    return {};
  }

  return {
    co2_downstream: Number.parseFloat(co2Subordinate.value),
  };
};

export const extractSubordinatesFromPath = (
  input: CO2ServiceCalculationResult,
  path: Partial<ResultSubordinate>[]
): ResultSubordinate | undefined => {
  let result: ResultSubordinate = input;

  for (const pathItem of path) {
    // find sub item by identifier and designation
    const item = result.subordinates.find((subordinate) =>
      matchItem(subordinate, pathItem)
    );

    if (!item) {
      return undefined;
    }

    result = item;
  }

  return result;
};

export const matchItem = (
  subordinate: ResultSubordinate,
  objectToMatch: Partial<ResultSubordinate>
): boolean =>
  Object.entries(objectToMatch).every(
    ([key, value]) => subordinate[key as keyof ResultSubordinate] === value
  );
