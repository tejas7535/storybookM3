import { FrictionCalculationResult } from '../store/models';
import {
  FrictionServiceCalculationResult,
  ResultSubordinate,
} from './friction-service.interface';

export const convertFrictionApiResult = (
  originalResult: FrictionServiceCalculationResult
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

    result.frictionalPowerloss = {
      value: Number.parseFloat(N_R.value),
      unit: N_R.unit,
    };

    result.frictionalPowerlossSealing = {
      value: Number.parseFloat(N_Se.value),
      unit: N_Se.unit,
    };

    result.frictionalPowerlossUnloadedZone = {
      value: Number.parseFloat(N_Uz.value),
      unit: N_Uz.unit,
    };

    result.frictionalTorque = {
      value: Number.parseFloat(M_R.value),
      unit: M_R.unit,
    };

    result.operatingViscosity = {
      value: Number.parseFloat(ny.value),
      unit: ny.unit,
    };
  }

  return result;
};

export const extractSubordinatesFromPath = (
  input: FrictionServiceCalculationResult,
  path: Partial<ResultSubordinate>[],
  requireValue?: boolean
): ResultSubordinate | undefined => {
  let result: ResultSubordinate = input;

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
  input: Partial<ResultSubordinate>
): Record<string, { unit: string; value: string }> | undefined => {
  if (!input.data) {
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
  subordinate: ResultSubordinate,
  objectToMatch: Partial<ResultSubordinate>
): boolean =>
  Object.entries(objectToMatch).every(([key, value]) =>
    key in subordinate
      ? subordinate[key as keyof ResultSubordinate] === value
      : value === undefined
  );
