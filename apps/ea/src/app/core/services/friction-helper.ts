import { FrictionCalculationResult } from '../store/models';
import {
  FrictionServiceCalculationResult,
  ResultSubordinate,
} from './friction-service.interface';

export const convertFrictionApiResult = (
  originalResult: FrictionServiceCalculationResult
): FrictionCalculationResult => {
  const co2Subordinate = extractSubordinatesFromPath(originalResult, [
    { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
    { titleID: 'STRING_OUTP_CO2', identifier: 'block' },
    { titleID: 'STRING_OUTP_CO2_EMISSIONS', identifier: 'variableBlock' },
    { identifier: 'variableLine' },
  ]);

  if (!co2Subordinate) {
    return {};
  }

  const result: FrictionCalculationResult = {
    co2_downstream: {
      unit: 'kg',
      value: Number.parseFloat(co2Subordinate.value),
    },
  };

  return result;
};

export const extractSubordinatesFromPath = (
  input: FrictionServiceCalculationResult,
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
