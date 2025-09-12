import { STRING_OUTP_SHAFT } from '@mm/core/services/bearinx-result.constant';

import { CalculationResult } from '../../models/calculation-result-state.model';

export const extractDeviationValuesFromThermalResult = (
  result: CalculationResult
): { upperDeviation: number; lowerDeviation: number } => {
  const inputs = result?.inputs;

  const shaftInputs = inputs?.find(
    (input) => input.titleID === STRING_OUTP_SHAFT
  );

  const [upperDeviation, lowerDeviation] =
    shaftInputs?.subItems
      .filter(
        (item) => item.abbreviation === 'FO_D' || item.abbreviation === 'FU_D'
      )
      .map((item) => item.value as unknown as number) || [];

  return {
    upperDeviation,
    lowerDeviation,
  };
};
