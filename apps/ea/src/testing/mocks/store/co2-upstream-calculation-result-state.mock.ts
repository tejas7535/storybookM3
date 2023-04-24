import { CO2UpstreamCalculationResultState } from '@ea/core/store/models';

export const CO2_UPSTREAM_CALCULATION_RESULT_STATE_MOCK: CO2UpstreamCalculationResultState =
  {
    isLoading: false,
    calculationResult: {
      unit: 'kg',
      upstreamEmissionFactor: 1,
      upstreamEmissionTotal: 2,
      weight: 0.2,
    },
  };
