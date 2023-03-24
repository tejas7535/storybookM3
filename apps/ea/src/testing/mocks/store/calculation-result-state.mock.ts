import { CalculationResultState } from '@ea/core/store/models';

export const CALCULATION_RESULT_STATE_MOCK: CalculationResultState = {
  co2: { upstream: 0, downstream: 0 },
  ratingLife: 0,
  isResultAvailable: false,
  isCalculationImpossible: false,
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
