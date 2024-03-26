import { ConversionResponse } from '../../app/models';

export const HARDNESS_CONVERSION_MOCK: ConversionResponse = {
  converted: [
    {
      unit: 'hrc',
      value: 42,
    },
    {
      unit: 'hv',
      value: 42,
    },
    {
      unit: 'hb',
      value: 42,
    },
    {
      unit: 'mpa',
      value: 42,
    },
  ],
  deviationWarning: false,
};

export const HARDNESS_CONVERSION_ERROR_MOCK: ConversionResponse = {
  converted: [],
  error: 'Conversion impossible',
};
