import { HardnessConversionResponse } from '@mac/feature/hardness-converter/models';

export const HARDNESS_CONVERSION_MOCK: HardnessConversionResponse = {
  converted: [
    {
      unit: 'HRc',
      value: 42,
    },
    {
      unit: 'HV',
      value: 42,
    },
    {
      unit: 'HB',
      value: 42,
    },
    {
      unit: 'MPa',
      value: 42,
    },
  ],
};

export const HARDNESS_CONVERSION_ERROR_MOCK: HardnessConversionResponse = {
  converted: [],
  error: 'Conversion impossible',
};
