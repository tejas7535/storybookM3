import { GreaseResult } from '../lib/models/grease-result.model';

export const greaseResultMock: GreaseResult = {
  mainTitle: 'Arcanol MULTI2',
  subTitle: 'Mineral oil',
  dataSource: [
    {
      title: 'initialGreaseQuantity',
      values:
        '<span>59.40 g</span></br><span class="text-low-emphasis">66 cm³</span>',
    },
    {
      title: 'manualRelubricationQuantityInterval',
      values:
        '<span>38.70 g/501 days</span><br><span class="text-low-emphasis">43.00 cm³/501 days</span>',
      tooltip: 'manualRelubricationQuantityIntervalTooltip',
    },
    {
      title: 'automaticRelubricationQuantityPerDay',
      values:
        '<span>0.0792 g/day</span><br><span class="text-low-emphasis">0.088 cm³/day</span>',
      tooltip: 'automaticRelubricationQuantityPerDayTooltip',
    },
    {
      title: 'greaseServiceLife',
      values: '~ 941 day',
    },
    {
      title: 'automaticRelubricationPerWeek',
      values:
        '<span>0.5544 g/7 days</span><br><span class="text-low-emphasis">0.616 cm³/7 days</span>',
    },
    {
      title: 'automaticRelubricationPerMonth',
      values:
        '<span>2.38 g/30 days</span><br><span class="text-low-emphasis">2.64 cm³/30 days</span>',
    },
    {
      title: 'automaticRelubricationPerYear',
      values:
        '<span>28.91 g/365 days</span><br><span class="text-low-emphasis">32.12 cm³/365 days</span>',
    },
    {
      title: 'viscosityRatio',
      values: '2.33',
    },
    {
      title: 'baseOilViscosityAt40',
      values: '110.0 mm²/s',
    },
    {
      title: 'lowerTemperatureLimit',
      values: '-20.0 °C',
      tooltip: 'lowerTemperatureLimitTooltip',
    },
    {
      title: 'upperTemperatureLimit',
      values: '120.0 °C',
      tooltip: 'upperTemperatureLimitTooltip',
    },
    {
      title: 'additiveRequired',
      values: 'no',
      tooltip: 'additiveRequiredTooltip',
    },
    {
      title: 'effectiveEpAdditivation',
      values: 'no',
    },
    {
      title: 'density',
      values: '0.900 kg/dm³',
    },
    {
      title: 'lowFriction',
      values: '0 (suitabilityLevelsuitable)',
    },
    {
      title: 'suitableForVibrations',
      values: '0 (suitabilityLevelsuitable)',
    },
    {
      title: 'supportForSeals',
      values: '0 (suitabilityLevelsuitable)',
    },
    {
      title: 'H1Registration',
      values: 'no',
    },
  ],
};
