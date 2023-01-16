import { AQMCalculationResponse } from '@mac/feature/aqm-calculator/models';

export const AQM_CALCULATION_CALCULATION_MOCK: AQMCalculationResponse = {
  // eslint-disable-next-line unicorn/no-null
  aqm: { error: null, result: 19.7 },
  limits: {
    '100Cr6': false,
    '100CrMnMoSi8-4-6': false,
    '100CrMnSi6-4': false,
    '100CrMo7': false,
    '100CrMo7-3': false,
  },
  sumValue: 1.75,
};

export const AQM_CALCULATION_ERROR_MOCK: AQMCalculationResponse = {
  // eslint-disable-next-line unicorn/no-null
  aqm: { error: 'the magic error message', result: null },
  limits: {
    '100Cr6': false,
    '100CrMnMoSi8-4-6': false,
    '100CrMnSi6-4': false,
    '100CrMo7': false,
    '100CrMo7-3': false,
  },
  sumValue: 1.75,
};
