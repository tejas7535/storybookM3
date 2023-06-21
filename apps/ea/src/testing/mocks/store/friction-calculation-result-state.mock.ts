import { FrictionCalculationResultState } from '@ea/core/store/models';

export const FRICTION_CALCULATION_RESULT_STATE_MOCK: FrictionCalculationResultState =
  {
    calculationResult: {
      co2_downstream: {
        unit: 'kg',
        value: 123,
      },
      reportInputSuborinates: {
        inputSubordinates: [
          {
            identifier: 'block',
            title: 'some title',
          },
        ],
      },
      reportMessages: {
        messages: [
          {
            title: 'Errors',
          },
          {
            title: 'Warnings',
          },
        ],
      },
    },
    isCalculationImpossible: false,
    isLoading: false,
    calculationError: undefined,
    calculationId: undefined,
  };
