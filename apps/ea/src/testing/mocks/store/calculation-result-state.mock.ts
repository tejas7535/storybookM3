import { CalculationResultState } from '@ea/core/store/models';

export const CALCULATION_RESULT_STATE_MOCK: CalculationResultState = {
  calculationResult: {
    co2_upstream: 0,
    co2_downstream: 0,
    ratingLife: 0,
  },
  isCalculationImpossible: false,
  isLoading: false,
  calculationError: undefined,
  calculationId: undefined,
  basicFrequenciesResult: {
    title: 'abc',
    rows: [],
  },
};

export const CALCULATION_RESULT_OVERLAY_DATA_MOCK = [
  {
    title: 'totalValueCO2',
    icon: 'airwave',
    values: [
      {
        title: 'production',
        value: 123,
        unit: 'kg',
      },
      {
        title: 'operation',
        value: 456,
        unit: 'kg',
      },
    ],
  },
  {
    title: 'overrollingFrequency',
    icon: 'airwave',
    values: [
      {
        title: 'overrollingFrequencySubtitle',
        value: 789,
        unit: 'mm²/s',
      },
    ],
  },
];
